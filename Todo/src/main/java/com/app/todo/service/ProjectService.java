package com.app.todo.service;

import java.util.List;
import java.util.UUID;

import com.app.todo.model.Project;
import com.app.todo.request.ProjectRequest;

public interface ProjectService {

	Project createProject(ProjectRequest project);

	List<Project> getUserProjects(UUID userId);

	Project getProjectById(UUID projectId);

	void deleteProject(UUID projectId);

	Project updateProjectTitle(UUID projectId, String newTitle);

}
