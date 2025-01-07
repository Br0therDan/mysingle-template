import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import {
  type ApiError,
  type UserPublic,
  type UpdatePassword,
  UsersService,
} from "@/client";
import useAuth from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { emailPattern, handleError } from "@/utils";

const UserInformation = () => {
  const queryClient = useQueryClient();
  const color = useColorModeValue("inherit", "ui.light");
  const showToast = useCustomToast();
  const [editMode, setEditMode] = useState(false);
  const { user: currentUser } = useAuth();

  // User Information Form
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<UserPublic>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.full_name,
      email: currentUser?.email,
    },
  });

  // Password Update Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { isSubmitting: isPasswordSubmitting, errors: passwordErrors },
  } = useForm<UpdatePassword>({
    mode: "onBlur",
    criteriaMode: "all",
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const userMutation = useMutation({
    mutationFn: (data: UserPublic) =>
      UsersService.updateUser({
        userId: currentUser?.id!,
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "User updated successfully.", "success");
      queryClient.invalidateQueries();
      toggleEditMode();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
      UsersService.updatePasswordMe({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Password updated successfully.", "success");
      resetPassword();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const onSubmitUserInfo: SubmitHandler<UserPublic> = async (data) => {
    userMutation.mutate(data);
  };

  const onSubmitPassword: SubmitHandler<UpdatePassword> = async (data) => {
    passwordMutation.mutate(data);
  };

  const onCancel = () => {
    reset();
    toggleEditMode();
  };

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          User Information
        </Heading>
        <Box
          w={{ sm: "full", md: "50%" }}
          as="form"
          onSubmit={handleSubmit(onSubmitUserInfo)}
        >
          <FormControl>
            <FormLabel color={color} htmlFor="name">
              Full name
            </FormLabel>
            {editMode ? (
              <Input
                id="name"
                {...register("full_name", { maxLength: 30 })}
                type="text"
                size="md"
                w="auto"
              />
            ) : (
              <Text
                size="md"
                py={2}
                color={!currentUser?.full_name ? "ui.dim" : "inherit"}
                isTruncated
                maxWidth="250px"
              >
                {currentUser?.full_name || "N/A"}
              </Text>
            )}
          </FormControl>
          <FormControl mt={4} isInvalid={!!errors.email}>
            <FormLabel color={color} htmlFor="email">
              Email
            </FormLabel>
            {editMode ? (
              <Input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
                type="email"
                size="md"
                w="auto"
              />
            ) : (
              <Text size="md" py={2} isTruncated maxWidth="250px">
                {currentUser?.email}
              </Text>
            )}
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>
          <Flex mt={4} gap={3}>
            <Button
              variant="primary"
              onClick={toggleEditMode}
              type={editMode ? "button" : "submit"}
              isLoading={editMode ? isSubmitting : false}
              isDisabled={editMode ? !isDirty || !getValues("email") : false}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
            {editMode && (
              <Button onClick={onCancel} isDisabled={isSubmitting}>
                Cancel
              </Button>
            )}
          </Flex>
        </Box>

        {/* Password Update Form */}
        <Heading size="sm" py={4} mt={6}>
          Change Password
        </Heading>
        <Box
          w={{ sm: "full", md: "50%" }}
          as="form"
          onSubmit={handlePasswordSubmit(onSubmitPassword)}
        >
          <FormControl mt={4} isInvalid={!!passwordErrors.current_password}>
            <FormLabel color={color} htmlFor="current_password">
              Current Password
            </FormLabel>
            <Input
              id="current_password"
              {...registerPassword("current_password", {
                required: "Current password is required",
              })}
              type="password"
              size="md"
              w="auto"
            />
            {passwordErrors.current_password && (
              <FormErrorMessage>
                {passwordErrors.current_password.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl mt={4} isInvalid={!!passwordErrors.new_password}>
            <FormLabel color={color} htmlFor="new_password">
              New Password
            </FormLabel>
            <Input
              id="new_password"
              {...registerPassword("new_password", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              type="password"
              size="md"
              w="auto"
            />
            {passwordErrors.new_password && (
              <FormErrorMessage>
                {passwordErrors.new_password.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            isLoading={isPasswordSubmitting}
          >
            Update Password
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default UserInformation;
