package com.app.todo.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.todo.model.ExportedGist;

public interface ExportedGistRepository extends JpaRepository<ExportedGist, Long> {
    List<ExportedGist> findByProjectId(UUID projectId);
}
