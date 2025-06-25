package com.app.todo.response;

import java.time.LocalDateTime;

import com.app.todo.model.ExportedGist;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Ensures only non-null fields are serialized
public class ExportedGistResponse {
    private Long id;
    private String gistId;
    private String gistUrl;
    private LocalDateTime exportedAt;
    private String projectTitle;

    public ExportedGistResponse(ExportedGist gist) {
        this.id = gist.getId();
        this.gistId = gist.getGistId();
        this.gistUrl = gist.getGistUrl();
        this.exportedAt = gist.getExportedAt();
        this.projectTitle = gist.getProject().getTitle();
    }
}