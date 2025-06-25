package com.app.todo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.todo.model.Todo;
import com.app.todo.request.UpdateTodoRequest;
import com.app.todo.service.TodoService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
	
	private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping("/{projectId}")
    public ResponseEntity<Todo> addTodo(@PathVariable UUID projectId, @RequestBody Todo todo) {
        return ResponseEntity.ok(todoService.addTodoToProject(projectId, todo));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Todo>> getTodos(@PathVariable UUID projectId) {
        return ResponseEntity.ok(todoService.getTodosByProject(projectId));
    }

    @PutMapping("/{todoId}")
    public ResponseEntity<Todo> updateTodo(@PathVariable UUID todoId, @RequestBody UpdateTodoRequest request) {
        return ResponseEntity.ok(todoService.updateTodo(todoId, request));
    }

    @DeleteMapping("/{todoId}")
    public ResponseEntity<Void> deleteTodo(@PathVariable UUID todoId) {
        todoService.deleteTodo(todoId);
        return ResponseEntity.noContent().build();
    }

}
