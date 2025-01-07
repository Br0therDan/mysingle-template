
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Suppose you have already refactored your DeleteConfirmation (AlertDialog),
 * we can import it and show/hide using local state.
 */
import DeleteConfirmation from "./DeleteConfirmation";

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm py-4">Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Permanently delete your data and everything associated with your
            account.
          </p>
          <Button
            variant="destructive"
            onClick={() => setIsOpen(true)}
            className="mt-2"
          >
            Delete
          </Button>
        </CardContent>
      </Card>

      {/* AlertDialog or Dialog for confirmation */}
      <DeleteConfirmation isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
