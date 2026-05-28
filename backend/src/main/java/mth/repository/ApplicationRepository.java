package mth.repository;

import mth.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
extends JpaRepository<Application, Long> {

    // Find all applications for a specific user
    List<Application> findByUser_Id(Long userId);
}
