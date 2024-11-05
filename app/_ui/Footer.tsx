import Link from "next/link";
import React from "react";

const links = [
  {
    text: "About",
    href: "#About"
  },
  {
    text: "Download the X app",
    href: "#Download the X app"
  },
  {
    text: "Help Center",
    href: "#Help Center"
  },
  {
    text: "Terms of Service",
    href: "#Terms of Service"
  },
  {
    text: "Privacy Policy",
    href: "#Privacy Policy"
  },
  {
    text: "Cookie Policy",
    href: "#Cookie Policy"
  },
  {
    text: "Accessibility",
    href: "#Accessibility"
  },
  {
    text: "Ads info",
    href: "#Ads info"
  },
  {
    text: "Blog",
    href: "#Blog"
  },
  {
    text: "Careers",
    href: "#Careers"
  },
  {
    text: "Brand Resources",
    href: "#Brand Resources"
  },
  {
    text: "Advertising",
    href: "#Advertising"
  },
  {
    text: "Marketing",
    href: "#Marketing"
  },
  {
    text: "X for Business",
    href: "#X for Business"
  },
  {
    text: "Developers",
    href: "#Developers"
  },
  {
    text: "Directory",
    href: "#Directory"
  },
  {
    text: "Settings",
    href: "#Settings"
  },
];

function Footer() {
  return (
    <footer>
      <ul className="text-[13px] flex items-center flex-wrap justify-center gap-4 mt-20">
        {links.map(link => (
          <li key={link.href} className="font-light w-max">
            <Link className="text-darkgray" href={link.href}>{link.text}</Link>
          </li>
        ))}
        <li>
          <p className="font-light w-max text-darkgray">© 2024 X Corp.</p>
        </li>
      </ul>
    </footer>
  )
}

export default Footer;
