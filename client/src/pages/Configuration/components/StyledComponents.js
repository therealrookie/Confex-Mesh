import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  justify-content: center;
`;

export const Players = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Define 4 columns */
  gap: 10px; /* Gap between grid items */
  margin-bottom: 20px;
`;

export const PlayerContainer = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-column: span ${(props) => props.span};
`;

export const ZoneContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ZoneShape = styled.div`
  position: relative;
  border: 1px solid #000;
  border-radius: 4px;
  margin: 10px 10px;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  width: ${(props) => (50 * props.$ratioWidth) / props.$ratioHeight}px;
  cursor: move;
`;

export const ZoneText = styled.div`
  position: absolute;
  text-align: center;
  white-space: nowrap;
`;

export const ComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ScreenContainer = styled.div`
  width: 800px;
  border: 2px dashed #ccc;
  height: 50px;
  margin: 20px 0;
  position: relative;
`;

export const DraggableShape = styled.div`
  padding: 0;
  position: absolute;
  border: 1px solid #000;
  border-radius: 4px;
  background-color: #e0e0e0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50px;
  cursor: move;
  width: ${(props) => (50 * props.$ratioWidth) / props.$ratioHeight}px;
`;

export const ZoneInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  span {
    display: block;
    width: 100%;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

export const CenterText = styled.p`
  flex-grow: 1;
  text-align: center;
  margin: 0;
`;

export const Buttons = styled.div`
  display: flex;
  gap: 10px;
`;

export const ButtonPlaceholder = styled.div`
  width: 170px;
`;

export const StyledButton = styled.button`
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  color: #fff;
  cursor: pointer;
`;

export const CancelButton = styled(StyledButton)`
  background-color: #dc3545;
`;

export const SaveButton = styled(StyledButton)`
  background-color: #28a745;
`;
