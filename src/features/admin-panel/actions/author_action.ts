'use server';

import { ApiError } from '@/lib/error';
import { getDb } from '@/lib/mongodb';
import { createSession } from '@/lib/session';
import bcrypt from 'bcrypt';
import {
  clientSideValidationSchema,
  ClientSideValidationSchema,
} from '../validation/author/client_side';

const authorSignUpInputDataValidation = (data: FormData): ClientSideValidationSchema => {
  const rawData = Object.fromEntries(data.entries());
  const validationResult = clientSideValidationSchema.safeParse(rawData);

  if (!validationResult.success) {
    throw new ApiError(
      400,
      'Server side input validation error happen',
      validationResult.error.flatten().fieldErrors,
    );
  }

  return validationResult.data;
};

export const createNewAuthorAction = async (data: FormData) => {
  const validData = authorSignUpInputDataValidation(data);
  try {
    const db = await getDb();
    const findUserExistOrNot = await db.collection('authors').findOne({ email: validData.email });

    if (findUserExistOrNot) {
      throw new Error('This is user is already sign up, Please try to log-in now');
    }

    const hashedPassword = await bcrypt.hash(validData.password, 12);

    // Define a type for the author document in MongoDB
    interface AuthorDocument {
      name: string;
      bio: string;
      email: string;
      occupation: string;
      password: string;
      location?: string;
      website?: string;
      profileImage?: string;
      _id?: ObjectId;
      // Approval system fields
      isApproved: boolean;
      approvalStatus: 'pending' | 'approved' | 'rejected';
      approvalNotes?: string;
      approvedById?: string;
      requestedAt: Date;
    }

    // Determine if the signing up user is the root user
    const rootUserEmail = process.env.ROOT_USER_EMAIL;
    const isRootUser = Boolean(rootUserEmail && validData.email === rootUserEmail);

    const newAuthor: Partial<AuthorDocument> = {
      name: validData.name,
      bio: validData.bio,
      email: validData.email,
      occupation: validData.occupation,
      password: hashedPassword,
      location: validData.location,
      website: validData.website,
      // Add approval system fields
      // Root user gets immediate approval and full access
      isApproved: isRootUser ? true : false,
      approvalStatus: isRootUser ? 'approved' : 'pending',
      requestedAt: new Date(),
    };

    // Add profileImage if it exists and is a string (URL)
    if (validData.profileImage && typeof validData.profileImage === 'string') {
      newAuthor.profileImage = validData.profileImage;
    }

    const insertAuthorToDB = await db.collection('authors').insertOne(newAuthor);

    if (!insertAuthorToDB.insertedId) {
      throw new Error('Failed to create the author in database! try again later');
    }

    await createSession({
      _id: insertAuthorToDB.insertedId.toString(),
      email: validData.email,
      name: validData.name,
      isApproved: isRootUser ? true : false,
      approvalStatus: isRootUser ? 'approved' : 'pending',
      isRootUser: isRootUser,
    });

    return insertAuthorToDB;
  } catch (ioError) {
    throw new ApiError(500, 'Internal Server Error', ioError);
  }
};

export const logInAuthorAction = async (email: string, password: string) => {
  try {
    const db = await getDb();
    const existingUser = await db.collection('authors').findOne({ email: email });
    if (!existingUser) {
      throw new Error('Invalid credentials');
    }
    const varifyPassword = await bcrypt.compare(password, existingUser.password);

    if (!varifyPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if user is root user
    const rootUserEmail = process.env.ROOT_USER_EMAIL;
    const isRootUser = Boolean(rootUserEmail && email === rootUserEmail);

    // If root user, ensure they're approved
    let isApproved = existingUser.isApproved || false;
    let approvalStatus = existingUser.approvalStatus || 'pending';

    if (isRootUser) {
      isApproved = true;
      approvalStatus = 'approved';
    }

    // Check if user is approved (unless root user)
    if (!isApproved && !isRootUser) {
      throw new Error('Invalid credentials');
    }

    // Return the user object for session creation
    return {
      _id: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
      isApproved: isApproved,
      approvalStatus: approvalStatus,
      isRootUser: isRootUser,
    };
  } catch (error) {
    throw new ApiError(401, 'Invalid credentials', error);
  }
};

import { ObjectId } from 'mongodb';

export const getAuthorByIdAction = async (id: string) => {
  try {
    const db = await getDb();
    const author = await db.collection('authors').findOne({ _id: new ObjectId(id) });
    if (!author) {
      throw new Error('Author not found');
    }
    return author;
  } catch (error) {
    throw new ApiError(500, 'Something went wrong', error);
  }
};

export const updateAuthorAction = async (
  id: string,
  data: FormData | ClientSideValidationSchema,
) => {
  let validData: ClientSideValidationSchema;

  // Handle both FormData and JSON input
  if (data instanceof FormData) {
    validData = authorSignUpInputDataValidation(data);
  } else {
    // For JSON data, validate directly
    const validationResult = clientSideValidationSchema.safeParse(data);
    if (!validationResult.success) {
      throw new ApiError(
        400,
        'Server side input validation error happened',
        validationResult.error.flatten().fieldErrors,
      );
    }
    validData = validationResult.data;
  }

  try {
    const db = await getDb();
    const updatedAuthor = await db
      .collection('authors')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: validData },
        { returnDocument: 'after' },
      );
    if (!updatedAuthor) {
      throw new Error('Author not found');
    }
    return updatedAuthor;
  } catch (error) {
    throw new ApiError(500, 'Something went wrong', error);
  }
};

export const getAuthorsAction = async (filter?: { approvalStatus?: string }) => {
  try {
    const db = await getDb();
    const query: { approvalStatus?: string } = {};
    if (filter?.approvalStatus) {
      query.approvalStatus = filter.approvalStatus;
    }
    const authors = await db
      .collection('authors')
      .find(query)
      .sort({ requestedAt: -1 }) // Sort by most recent first
      .toArray();
    return authors;
  } catch (error) {
    throw new ApiError(500, 'Something went wrong', error);
  }
};
