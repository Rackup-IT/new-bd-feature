import {
  footerLinkColumnOne,
  footerLinkColumnTwo,
  otherLinks,
  socialMediaLinks,
} from "../data/data";
import FooterLink from "./footer_link";
import SocialMediaLink from "./socialmedia_link";

const Footer = () => {
  return (
    <footer
      className="mt-auto bg-gray-900 text-center text-white md:text-left lg:text-left"
      data-testid="footer"
    >
      <section className="tc-container wrapper mx-auto grid grid-cols-12 py-6">
        <nav className="order-2 col-span-full flex flex-col sm:col-span-4 md:order-1 xl:col-span-3">
          {footerLinkColumnOne.map((link, index) => {
            return (
              <FooterLink key={index} href={link.href}>
                {link.text}
              </FooterLink>
            );
          })}
        </nav>
        <nav className="order-1 col-span-full flex flex-col sm:col-span-4 md:order-2 xl:col-span-3">
          {footerLinkColumnTwo.map((link, index) => {
            return (
              <FooterLink key={index} href={link.href}>
                {link.text}
              </FooterLink>
            );
          })}
        </nav>
        <div className="order-last col-span-full flex flex-row flex-wrap place-content-start justify-center gap-3 justify-self-end py-5 sm:col-span-4 sm:justify-start lg:py-0 xl:col-span-6">
          {socialMediaLinks.map((link, index) => {
            return (
              <SocialMediaLink key={index} title={link.title} href={link.href}>
                {link.icon}
              </SocialMediaLink>
            );
          })}
        </div>
      </section>
      <div className="bg-black">
        <section className="tc-container wrapper mx-auto flex flex-col gap-4 py-4 text-2xs md:flex-row 2xl:text-xs">
          {otherLinks.map((link, index) => {
            return (
              <FooterLink key={index} href={link.href}>
                {link.text}
              </FooterLink>
            );
          })}
          <div className="mx-auto lg:ml-auto lg:mr-0">
            <span>
              Copyright © 2010–2025,{" "}
              <a href="https://theconversation.com/global/who-we-are">
                The BD-Feature
              </a>
            </span>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
