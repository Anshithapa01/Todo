package com.app.todo.service;

import java.util.List;
import java.util.UUID;

import com.app.todo.model.ExportedGist;

public interface ExportedGistService {

	ExportedGist exportProjectAsGist(UUID projectId);

	List<ExportedGist> getAllGists();

}
