import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { FaPlus } from "react-icons/fa";

interface NavbarProps {
  type: string;
  addModalAs: React.ElementType;
}

const Navbar: React.FC<NavbarProps> = ({ type, addModalAs: AddModal }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="flex py-8 gap-4">
      {/* Add Button */}
      <Button className="flex items-center gap-2" onClick={handleOpen}>
        <FaPlus /> Add {type}
      </Button>

      {/* Add Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {type}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {/* AddModal is dynamically injected */}
            <AddModal isOpen={isOpen} onClose={handleClose} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;