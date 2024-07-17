import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 20px 0;
  text-align: center;
  bottom: 0;
  width: 100%;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const FooterNav = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  gap: 15px;
`;

const FooterNavItem = styled.li`
  display: inline;
`;

const FooterNavLink = styled.a`
  color: #fff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; {new Date().getFullYear()} sld-mediatec GmbH</p>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

/*
<nav>
          <FooterNav>
            <FooterNavItem>
              <FooterNavLink href="/privacy-policy">Privacy Policy</FooterNavLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterNavLink href="/terms-of-service">Terms of Service</FooterNavLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterNavLink href="/contact-us">Contact Us</FooterNavLink>
            </FooterNavItem>
          </FooterNav>
        </nav>
*/
