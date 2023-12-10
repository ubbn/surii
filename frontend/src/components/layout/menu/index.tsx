import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { FlexRow } from "../../../common";

type MenuEntry = {
  title: string;
  path: string;
};

const menus: MenuEntry[] = [
  { title: "Home", path: "" },
  { title: "Learn", path: "learn" },
  { title: "Stats", path: "stats" },
];

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    const activePath = location.pathname.replace("/", "");
    const found = menus.find((v) => v.path === activePath);
    if (found) {
      setActive(menus.indexOf(found));
    }
  }, [location]);

  return (
    <Container>
      {menus.map((menuItem, i) => (
        <FlexRow key={i}>
          <Text onClick={() => navigate(menuItem.path)} selected={i === active}>
            {menuItem.title}
          </Text>
          {i < menus.length - 1 && <Separator> |</Separator>}
        </FlexRow>
      ))}
    </Container>
  );
};

export default Menu;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Text = styled.div<{ selected: boolean }>`
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 400;
  cursor: pointer;
  border-bottom: ${(props) => (props.selected ? "1px solid white" : "none")};
`;

const Separator = styled.span`
  margin: 0 20px;
`;
