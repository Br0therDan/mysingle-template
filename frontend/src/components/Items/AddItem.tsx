// src/components/Items/AddItem.tsx

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, SubmitHandler } from "react-hook-form"

import { ApiError, ItemCreate, ItemsService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"
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

interface AddItemProps {
  isOpen: boolean
  onClose: () => void
}

const AddItem = ({ isOpen, onClose }: AddItemProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ItemCreate) => ItemsService.createItem({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Item created successfully.", "success")
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

  const onSubmit: SubmitHandler<ItemCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogOverlay />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new item.
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
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <MyButton type="submit" isLoading={isSubmitting}>
              Save
            </MyButton>
          </DialogFooter>
        </form>
        <DialogClose className="absolute top-4 right-4" />
      </DialogContent>
    </Dialog>
  )
}

export default AddItem
