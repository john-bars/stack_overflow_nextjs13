"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };

  // Common function for deleting an entity with confirmation, success, and error handling
  const deleteEntity = async (
    deleteFunction: Function,
    params: any,
    successTitle: string,
    errorTitle: string
  ) => {
    // Ask for confirmation before deletion
    const confirmed = window.confirm(`Do you want to delete the ${type}?`);

    if (confirmed) {
      try {
        await deleteFunction(params);
        toast({
          title: successTitle,
        });
      } catch (error: any) {
        toast({
          title: errorTitle,
          description: error.message || "An error occurred during deletion.",
        });
      }
    } else {
      toast({
        title: "Deletion canceled",
      });
    }
  };

  const handleDelete = async () => {
    if (type === "Question") {
      const params = {
        questionId: JSON.parse(itemId),
        path: pathname,
      };
      await deleteEntity(
        deleteQuestion,
        params,
        "Question deleted successfully",
        "Error deleting the question"
      );
    } else if (type === "Answer") {
      const params = {
        answerId: JSON.parse(itemId),
        path: pathname,
      };
      await deleteEntity(
        deleteAnswer,
        params,
        "Answer deleted successfully",
        "Error deleting the answer"
      );
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
