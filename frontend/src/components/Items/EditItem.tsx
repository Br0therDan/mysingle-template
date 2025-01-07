// src/components/Items/EditItem.tsx


import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, SubmitHandler } from "react-hook-form"

import { ApiError, ItemPublic, ItemUpdate, ItemsService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

// Shadcn UI components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormControl, FormMessage } from "@/components/ui/form"
import { MyButton } from '../buttons/submit-button'

interface EditItemProps {
  item: ItemPublic
  isOpen: boolean
  onClose: () => void
}

const EditItem = ({ item, isOpen, onClose }: EditItemProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<ItemUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: item.title,
      description: item.description,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ItemUpdate) =>
      ItemsService.updateItem({ itemId: item.id, requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Item updated successfully.", "success")
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  const onSubmit: SubmitHandler<ItemUpdate> = (data) => {
    mutation.mutate(data)
  }

  const onCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogOverlay />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details of your item below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormControl aria-invalid={!!errors.title}>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title", {
                  required: "Title is required.",
                })}
                placeholder="Title"
                type="text"
              />
              {errors.title && <FormMessage>{errors.title.message}</FormMessage>}
            </FormControl>
            <FormControl>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Description"
                type="text"
              />
            </FormControl>
          </div>
          <DialogFooter className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <MyButton type="submit" isLoading={isSubmitting} disabled={!isDirty}>
              Save
            </MyButton>
          </DialogFooter>
        </form>
        <DialogClose className="absolute top-4 right-4" />
      </DialogContent>
    </Dialog>
  )
}

export default EditItem
