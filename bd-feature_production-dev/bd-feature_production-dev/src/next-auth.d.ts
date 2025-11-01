/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "next-auth" {
  const NextAuth: any;
  export default NextAuth;
  export type Session = any;
}

declare module "next-auth/providers/google" {
  const x: any;
  export default x;
}
declare module "next-auth/providers/facebook" {
  const x: any;
  export default x;
}
declare module "next-auth/providers/twitter" {
  const x: any;
  export default x;
}
declare module "next-auth/providers/linkedin" {
  const x: any;
  export default x;
}
