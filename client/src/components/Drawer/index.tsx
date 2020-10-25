import React, { ReactNode, useState } from "react";
import Drawer, { DrawerProps } from "@material-ui/core/Drawer";

import "./styles.scss";

interface QuestionProps extends DrawerProps {
  children: ReactNode;
  isCollapseAble: boolean;
  shouldBeCollapsed?: boolean;
  title: string;
}

export default ({
  children,
  isCollapseAble,
  shouldBeCollapsed,
  title,
  ...drawerProps
}: QuestionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Drawer
      {...{
        className: `drawer ${
          isCollapsed && shouldBeCollapsed ? "collapsed" : ""
        }`,
        ...drawerProps,
      }}
    >
      <div className="d-flex align-items-center flex-column">
        {isCollapseAble ? (
          <span id="newQuestion" className="w-100">
            <button
              onClick={() => {
                setIsCollapsed(!isCollapsed);
              }}
            >
              {title}
            </button>
          </span>
        ) : (
          <span id="newQuestion">{title}</span>
        )}

        <div className="container px-5 pt-4 pb-5 d-flex flex-column">
          {children}
        </div>
      </div>
    </Drawer>
  );
};
