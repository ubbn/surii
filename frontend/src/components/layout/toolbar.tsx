import { BoldOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu as AntMenu, Popover, message } from "antd";
import { signOut as logOutFirebase } from "firebase/auth";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { BASE_COLOR, FlexRow, Profile } from "../../common";
import { setAuth } from "../../common/storage";
import Tooltip from "../../common/tooltip";
import { resetAll } from "../../redux/mainSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import { auth } from "../auth/firebase";
import iconProfile from "./icon-profile.svg";
import Menu from "./menu";

type MenuItem = Required<MenuProps>['items'][number];

const userMenuItems: MenuItem[] = [
  {
    label: 'Profile',
    key: '/profile',
    icon: <UserOutlined />,
  },
  {
    label: 'Blog',
    key: '/blog',
    icon: <BoldOutlined />,
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: <LogoutOutlined />
  },
]

const loginMenuItems: MenuItem[] = [
  {
    label: 'Login',
    key: '/login',
    icon: <UserOutlined />,
  },
]

const Container = styled.div`
  max-width: 100%;
  top: 0;
  position: sticky;
  background-color: ${BASE_COLOR};
  padding: 6px 30px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  z-index: 999;

  @media (max-width: 600px) {
    padding: 6px 20px;
  }
`;


const Toolbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const authState = useSelector((state: RootState) => state.auth);
  const { name, profileUrl, isAuthenticated } = authState;
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(resetAll());
    setAuth(undefined);
    logOutFirebase(auth)
      .then(() => message.info("You are signed out"))
      .catch((e) => console.log("Failed to log out: ", e));
    navigate("/login");
  };

  const onClickMenu = (item: { key: string }) => {
    setMenuOpen(false);
    if (item.key === "logout") {
      logout()
    } else {
      navigate(item.key);
    }
  }

  return (
    <Container>
      <Menu />
      <FlexRow>
        <Tooltip text={name ? `Hello, ${name}` : ""}>
          <Popover
            placement="bottomRight"
            open={menuOpen}
            content={
              <AntMenu items={isAuthenticated ? userMenuItems : loginMenuItems}
                mode="vertical" onClick={onClickMenu} style={{ minWidth: 170 }}
              />
            }
            onOpenChange={setMenuOpen}
            trigger="click"
          >
            <Profile src={profileUrl || iconProfile} alt={"profile"} />
          </Popover>
        </Tooltip>
      </FlexRow>
    </Container>
  );
};

export default Toolbar;
