import { taskState, type Task, type TaskRepository, type TaskUseCase } from "$lib/domain/task.svelte";




export class TaskUseCaseimpl implements TaskUseCase {

  private repo: TaskRepository

  constructor(repo: TaskRepository) {
    this.repo = repo
  }
  async ListTasks(): Promise<Task[] | null> {
    taskState.loading = true
    try {
      const tasks = await this.repo.List()
      return tasks
    } catch (error: any) {
      taskState.errMessage = error.message
      return null
    } finally {
      taskState.loading = false
    }
  }


  async CreateTask(task: Task): Promise<Task | null> {
    return null
  }
}


