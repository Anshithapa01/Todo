package com.app.todo.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.todo.model.ExportedGist;
import com.app.todo.repository.ExportedGistRepository;
import com.app.todo.response.ExportedGistResponse;
import com.app.todo.service.ExportedGistService;

@RestController
@RequestMapping("/api/gist")
public class GistController {

    @Autowired
    private ExportedGistService gistService;
    @Autowired
    private ExportedGistRepository exportedGistRepository;

    @PostMapping("/export/{projectId}")
    public ResponseEntity<ExportedGist> exportProjectToGist(@PathVariable UUID projectId) {
        ExportedGist exportedGist = gistService.exportProjectAsGist(projectId);
        return ResponseEntity.ok(exportedGist);
    }
    
    @GetMapping
    public ResponseEntity<List<ExportedGistResponse>> getAllGists() {
        List<ExportedGist> gists = exportedGistRepository.findAll();
        List<ExportedGistResponse> response = gists.stream()
            .map(ExportedGistResponse::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
