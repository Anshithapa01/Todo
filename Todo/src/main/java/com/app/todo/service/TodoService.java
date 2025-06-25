package com.app.todo.service;

import java.util.List;
import java.util.UUID;

import com.app.todo.model.Todo;
import com.app.todo.request.UpdateTodoRequest;

public interface TodoService {

	void deleteTodo(UUID todoId);

	List<Todo> getTodosByProject(UUID projectId);

	Todo addTodoToProject(UUID projectId, Todo todo);

	Todo updateTodo(UUID todoId, UpdateTodoRequest request);

}
