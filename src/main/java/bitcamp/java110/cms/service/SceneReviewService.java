package bitcamp.java110.cms.service;

import bitcamp.java110.cms.domain.SceneReview;
import info.movito.themoviedbapi.model.MovieDb;

public interface SceneReviewService {
  
  void add(SceneReview sceneReview);
  SceneReview makeSceneCover(MovieDb tmdbMovie);
  
}
