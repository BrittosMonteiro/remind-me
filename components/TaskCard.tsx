import { Task } from "@prisma/client";
import React, { useTransition } from "react";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { changeTaskStatus, deleteTask } from "@/actions/task";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import DeleteIcon from "./icons/DeleteIcon";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { AlertDescription, AlertTitle } from "./ui/alert";

interface Props {
  task: Task;
}

function getExpirationColor(expiresAt: Date) {
  const days = Math.floor(expiresAt.getTime() - Date.now()) / 1000 / 60 / 60;

  if (days <= 0) return "text-gray-500 dark:text-gray-300";
  if (days <= 3 * 24) return "text-red-500 dark:text-red-400";
  if (days <= 7 * 24) return "text-orange-500 dark:text-orange-400";
  return "text-green-500 dark:text-green-400";
}

function TaskCard({ task }: Props) {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const removeTask = async () => {
    try {
      await deleteTask(task.id);
      router.refresh();
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Task could not be deleted. Try again later",
      });
    }
  };

  return (
    <div className="flex gap-2 items-start justify-between">
      <div className="flex gap-2 items-start">
        <Checkbox
          id={task.id.toString()}
          className="w-5 h-5"
          checked={task.done}
          disabled={isLoading}
          onCheckedChange={(e) =>
            startTransition(async () => {
              try {
                await changeTaskStatus(task.id, e);
                router.refresh();
                toast({
                  title: "Success",
                  description: "Status changed successfully",
                });
              } catch (err: any) {
                toast({
                  title: "Error",
                  description: "Status could not be changed",
                });
              }
            })
          }
        />
        <label
          htmlFor={task.id.toString()}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 decoration:1 dark:decoration-white gap-2",
            task.done && "line-through"
          )}
        >
          {task.content}
          {task.expiresAt && (
            <p
              className={cn(
                "text-xs text-neutral-500 dark:text-neutral-400",
                getExpirationColor(task.expiresAt)
              )}
            >
              {format(task.expiresAt, "dd/MM/yyyy")}
            </p>
          )}
        </label>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className="text-neutral-500">
            <DeleteIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertTitle>Do you want to delete this task?</AlertTitle>
          <AlertDescription>This action cannot be undone.</AlertDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => startTransition(removeTask)}>
              Procced
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TaskCard;
