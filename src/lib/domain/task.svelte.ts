import type { MetaData } from "./global/global"



export interface Task {
  ID: number
  Title: string
  Description: string
}

export interface TaskUseCase {
  CreateTask(task: Task): Promise<Task | null>
  ListTasks(): Promise<Task[] | null>
}

export interface TaskRepository {
  Create(task: Task): Promise<Task | null>
  List(): Promise<Task[] | null>
}

type taskState = {
  tasks: Task[] | null
  loading: boolean
  meta: MetaData | null
  errMessage: string | null
}

export let taskState = $state<taskState>({
  tasks: null,
  loading: false,
  meta: null,
  errMessage: null
})








