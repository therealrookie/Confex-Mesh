import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

export const PlayerContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

export const ZoneContainer = styled.div`
  display: flex;
  flex-direction: row;
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
  position: absolute;
  border: 1px solid #000;
  border-radius: 4px;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  cursor: move;
  width: ${(props) => (50 * props.$ratioWidth) / props.$ratioHeight}px;
`;
