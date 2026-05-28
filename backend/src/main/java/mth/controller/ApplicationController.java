package mth.controller;

import mth.model.Application;
import mth.repository.ApplicationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ApplicationController {

    private final ApplicationRepository repo;

    public ApplicationController(ApplicationRepository repo) {
        this.repo = repo;
    }

    // GET all applications (admin use)
    @GetMapping("/applications")
    public List<Application> getApplications() {
        return repo.findAll();
    }

    // GET applications for a specific user
    @GetMapping("/applications/user/{userId}")
    public List<Application> getApplicationsByUser(@PathVariable Long userId) {
        return repo.findByUser_Id(userId);
    }

    // POST apply for a job
    @PostMapping("/applications")
    public Application applyJob(@RequestBody Application application) {
        return repo.save(application);
    }

    // DELETE withdraw an application
    @DeleteMapping("/applications/{id}")
    public ResponseEntity<Void> withdrawApplication(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
