package com.app.todo.service.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.app.todo.enums.TodoStatus;
import com.app.todo.model.Project;
import com.app.todo.model.Todo;
import com.app.todo.repository.ProjectRepository;
import com.app.todo.repository.TodoRepository;
import com.app.todo.request.UpdateTodoRequest;
import com.app.todo.service.TodoService;

@Service
public class TodoServiceImpl implements TodoService{

	private final TodoRepository todoRepository;
    private final ProjectRepository projectRepository;

    public TodoServiceImpl(TodoRepository todoRepository, ProjectRepository projectRepository) {
        this.todoRepository = todoRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public Todo addTodoToProject(UUID projectId, Todo todo) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        todo.setProject(project);
        return todoRepository.save(todo);
    }

    @Override
    public List<Todo> getTodosByProject(UUID projectId) {
        return todoRepository.findByProjectId(projectId);
    }

    @Override
    public Todo updateTodo(UUID todoId, UpdateTodoRequest request) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        if (request.getCompleted() != null) {
            todo.setStatus(request.getCompleted() ? TodoStatus.COMPLETED : TodoStatus.PENDING);
        }
        if(request.getDescription()!=null) {
        	todo.setDescription(request.getDescription());
        }
        todo.setUpdatedAt(LocalDateTime.now());
        

        return todoRepository.save(todo);
    }


    @Override
    public void deleteTodo(UUID todoId) {
        todoRepository.deleteById(todoId);
    }
}
