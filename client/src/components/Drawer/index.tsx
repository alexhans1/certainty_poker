import React, { ReactNode } from "react";
import Drawer, { DrawerProps } from "@material-ui/core/Drawer";

import "./styles.scss";

interface QuestionProps extends DrawerProps {
  children: ReactNode;
  title: string;
  onClose?: () => void;
}

export default ({
  children,
  title,
  onClose,
  ...drawerProps
}: QuestionProps) => {
  return (
    <Drawer
      {...{
        className: "drawer",
        ...drawerProps,
      }}
    >
      <div className="d-flex align-items-center flex-column">
        <div className="d-flex" id="drawer-title">
          <span className="ml-auto">{title}</span>
          {onClose && (
            <span id="drawer-close" className="ml-auto mr-3" onClick={onClose}>
              ╳
            </span>
          )}
        </div>

        <div className="container px-5 pt-4 pb-5 d-flex flex-column">
          {children}
        </div>
      </div>
    </Drawer>
  );
};
