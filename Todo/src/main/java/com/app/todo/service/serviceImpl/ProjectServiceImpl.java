package com.app.todo.service.serviceImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.app.todo.model.Project;
import com.app.todo.model.User;
import com.app.todo.repository.ProjectRepository;
import com.app.todo.repository.UserRepository;
import com.app.todo.request.ProjectRequest;
import com.app.todo.service.ProjectService;

@Service
public class ProjectServiceImpl implements ProjectService{
	
	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository,
    		UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository=userRepository;
    }

    @Override
    public Project createProject(ProjectRequest projectRequest) {
        User user = userRepository.findById(projectRequest.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Project existingProject = projectRepository.findByUserIdAndTitle(user.getId(), projectRequest.getTitle());
        if (existingProject != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Project with this title already exists for the user");
        }

        Project project = new Project();
        project.setTitle(projectRequest.getTitle());
        project.setUser(user);

        return projectRepository.save(project);
    }

    
    @Override
    public Project updateProjectTitle(UUID projectId, String newTitle) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setTitle(newTitle);
        return projectRepository.save(project);
    }


    @Override
    public List<Project> getUserProjects(UUID userId) {
        return projectRepository.findByUserId(userId);
    }

    @Override
    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public void deleteProject(UUID projectId) {
        projectRepository.deleteById(projectId);
    }

}
