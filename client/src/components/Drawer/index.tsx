import React, { ReactNode } from "react";
import Drawer, { DrawerProps } from "@material-ui/core/Drawer";

import "./styles.css";

interface Props extends DrawerProps {
  children: ReactNode;
  onClose?: () => void;
}

export default ({ children, onClose, ...drawerProps }: Props) => {
  return (
    <Drawer
      {...{
        ...drawerProps,
      }}
    >
      <div className="flex items-center flex-col bg-gray-200 py-4 min-h-52">
        {onClose && (
          <span
            id="drawer-close"
            className="ml-auto mr-3 -mb-4 -mt-2"
            onClick={onClose}
          >
            ╳
          </span>
        )}

        <div className="container px-5 pb-5 flex flex-col">{children}</div>
      </div>
    </Drawer>
  );
};
