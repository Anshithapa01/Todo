package com.app.todo.service.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.app.todo.enums.TodoStatus;
import com.app.todo.exception.ResourceNotFoundException;
import com.app.todo.model.ExportedGist;
import com.app.todo.model.Project;
import com.app.todo.repository.ExportedGistRepository;
import com.app.todo.repository.ProjectRepository;
import com.app.todo.service.ExportedGistService;

@Service
public class ExportedGistServiceImpl implements ExportedGistService{

	@Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ExportedGistRepository exportedGistRepository;

    private final String GITHUB_ACCESS_TOKEN = System.getenv("GITHUB_ACCESS_TOKEN");
    
    @Override
    public List<ExportedGist> getAllGists() {
        return exportedGistRepository.findAll();
    }

    @Override
    public ExportedGist exportProjectAsGist(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        String markdownContent = generateMarkdownContent(project);

        String gistResponse = createGistOnGitHub(project.getTitle(), markdownContent);

        JSONObject responseJson = new JSONObject(gistResponse);
        String gistId = responseJson.getString("id");
        String gistUrl = responseJson.getString("html_url");

        // Save Gist details in DB
        ExportedGist exportedGist = new ExportedGist();
        exportedGist.setProject(project);
        exportedGist.setGistId(gistId);
        exportedGist.setGistUrl(gistUrl);
        exportedGist.setExportedAt(LocalDateTime.now());

        return exportedGistRepository.save(exportedGist);
    }

    private String generateMarkdownContent(Project project) {
    	long completed = project.getTodos().stream()
    	        .filter(todo -> todo.getStatus() == TodoStatus.COMPLETED)
    	        .count();

    	long total = project.getTodos().size();

    	StringBuilder markdown = new StringBuilder();
    	markdown.append("# ").append(project.getTitle()).append("\n\n");
    	markdown.append("**Summary:** ").append(completed).append("/").append(total).append(" todos completed\n\n");

    	// Pending Tasks
    	markdown.append("## Pending\n");
    	project.getTodos().stream()
    	    .filter(todo -> todo.getStatus() == TodoStatus.PENDING)
    	    .forEach(todo -> markdown.append("- [ ] ").append(todo.getDescription()).append("\n"));

    	// Completed Tasks
    	markdown.append("\n## Completed\n");
    	project.getTodos().stream()
    	    .filter(todo -> todo.getStatus() == TodoStatus.COMPLETED)
    	    .forEach(todo -> markdown.append("- [x] ").append(todo.getDescription()).append("\n"));


        return markdown.toString();
    }

    private String createGistOnGitHub(String projectTitle, String content) {
        RestTemplate restTemplate = new RestTemplate();

        JSONObject fileObject = new JSONObject();
        fileObject.put(projectTitle + ".md", new JSONObject().put("content", content));

        JSONObject gistObject = new JSONObject();
        gistObject.put("description", "Project summary for: " + projectTitle);
        gistObject.put("public", false); // Secret Gist
        gistObject.put("files", fileObject);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + GITHUB_ACCESS_TOKEN);
        headers.set("Accept", "application/vnd.github+json");
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(gistObject.toString(), headers);

        ResponseEntity<String> response = restTemplate.exchange(
                "https://api.github.com/gists",
                HttpMethod.POST,
                entity,
                String.class
        );

        return response.getBody();
    }
}
