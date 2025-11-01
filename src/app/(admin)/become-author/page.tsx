import Link from 'next/link';

import AuthorForm from '../../../features/admin-panel/components/author/author_form';

const BecomeAuthor = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const srcParam = await searchParams;
  const isSignUp = srcParam.type === 'sign-up';

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <h1 className="font-bold text-3xl">BD FEATURE</h1>
            <Link
              href={isSignUp ? '/become-author' : '/become-author?type=sign-up'}
              className="bg-black text-white rounded-full h-6 px-3 font-semibold"
            >
              {isSignUp ? 'Log In' : 'Sing Up'}
            </Link>
          </div>
          <p className="mb-4">{isSignUp ? 'Create New Account' : 'Welcome back'}</p>
          {/* Log IN Section  */}
          <AuthorForm isSignUp={isSignUp} />
        </div>
      </div>
    </>
  );
};

export default BecomeAuthor;
