package com.app.todo.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "users")
public class User {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // Will be stored as a hashed value

    @Column(unique = true, nullable = false)
    private String email;
    
    //Relationships

    @JsonManagedReference("user-project")
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Project> projects;

}
