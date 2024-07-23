import React from "react";
import styled from "styled-components";

const SectionContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RatioRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 2px 0px;
`;

const Section = styled.div`
  margin: 0 2px;
  padding: 0;
  height: 50px;
  aspect-ratio: ${(props) => props.$ratio};
  background-color: #fff;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SectionsContainer = ({ sections }) => {
  const sectionsMap = new Map();

  Object.entries(sections).forEach(([section, ratio]) => {
    if (!sectionsMap.has(ratio)) {
      sectionsMap.set(ratio, []);
    }
    sectionsMap.get(ratio).push(
      <Section key={section} $ratio={ratio.replace(":", "/")}>
        {ratio}
      </Section>
    );
  });

  return (
    <SectionContainerWrapper>
      {Array.from(sectionsMap.entries()).map(([ratio, sections]) => (
        <RatioRow key={ratio}>{sections}</RatioRow>
      ))}
    </SectionContainerWrapper>
  );
};

export default SectionsContainer;
