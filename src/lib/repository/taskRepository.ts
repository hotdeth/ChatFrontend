import type { TaskRepository } from "$lib/domain/task.svelte";





class taskRepositoryimpl implements TaskRepository {
  async Create(task: Task): Promise<Task | null> {

  }


  async List(): Promise<Task[] | null> {

  }
}
