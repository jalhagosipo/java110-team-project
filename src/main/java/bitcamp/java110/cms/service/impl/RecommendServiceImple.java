package bitcamp.java110.cms.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import bitcamp.java110.cms.common.Constants;
import bitcamp.java110.cms.dao.MovieAnlyDao;
import bitcamp.java110.cms.dao.MovieDao;
import bitcamp.java110.cms.dao.RecommendDao;
import bitcamp.java110.cms.domain.Movie;
import bitcamp.java110.cms.domain.Theme;
import bitcamp.java110.cms.service.RecommendService;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.model.MovieDb;

@Service
public class RecommendServiceImple implements RecommendService {
  
  @Autowired TmdbMovies tmdbMovies;
  @Autowired RecommendDao rcmdDao;
  @Autowired Environment env;
  @Autowired MovieAnlyDao anlyDao;
  @Autowired MovieDao mvDao;
  
  
  
  @Override
  public String getListName(int thmno) {
    return rcmdDao.getTitle(thmno);
  }
  
  @Override
  public List<Theme> getAllTitle() {
    return rcmdDao.getAllTitle();
  }
  
  @Override
	public List<Movie> getRcmdMvList(int thmno) {
	    List<Integer> idList = rcmdDao.findMgrRcmdListById(thmno);
	    List<Movie> mvList = new ArrayList<>(); 
	    for (int i = 0; i < idList.size(); i++) {
	      int id = (int)idList.get(i);
	      mvList.add(new Movie(id, getMvById(id).getTitle()));
	    }
	    return mvList;
	}
  
  @Override
  public List<MovieDb> getList(int thmno){
    List<Integer> idList = rcmdDao.findMgrRcmdListById(thmno);
    List<MovieDb> mvList = new ArrayList<>(); 
    for (int i = 0; i < idList.size(); i++) {
      int id = (int)idList.get(i);
      MovieDb mv = getMvById(id);
      mvList.add(mv);
    }
    return mvList;
  }

  @Override
  public void addMovieList(Theme theme ,List<Movie> movieList) {
   
    Map<String, Object> params = new HashMap<String, Object>();
    System.out.println(movieList.size());
    for(int i=0; i<movieList.size(); i++) {
      
      mvDao.insertNotExists(movieList.get(i));
      params.put("thmno", theme.getThmno());
      params.put("mvno", movieList.get(i).getMvno());
      System.out.println("thmno: "+theme.getThmno());
      System.out.println("mvno"+ movieList.get(i).getMvno());
      rcmdDao.addMovieList(params);
    }
    
  }
  
  @Override
  public MovieDb getMvById(int mvno) {
    String tmdbKey = env.getProperty("tmdb.key");
    
    tmdbMovies = new TmdbApi(tmdbKey).getMovies();
    MovieDb mvdb = tmdbMovies.getMovie(mvno, Constants.LANGUAGE_KO);
    
    /* Test 
    System.out.println("mvdb : " + mvdb.toString());
    System.out.println(mvdb.getOverview());
    System.out.println(mvdb.getBackdropPath());
    System.out.println(mvdb.getRuntime());
    List <Genre> genres = mvdb.getGenres();
    Map <String, Integer> params = new HashMap<>();
    if(genres.size() > 0) {
      System.out.println(genres);
      for(Genre g : genres) {
        System.out.println(mvdb.getId() + ", " + g.getId());
        params.put("mvno", mvdb.getId());
        params.put("grno", g.getId());
        mvAnlyDao.insertGrNotExists(params);
      }
    }
    */
    return mvdb;
  }

  @Override
  public int getCount() {
    return rcmdDao.getCount();
  }
  
  @Override
  public int[] RandomNums(int root, int range){
    int[] n = new int[range];
    for (int i = 0; i < n.length; i++) {
      n[i] = (int)(Math.random() * root + 1);
      for (int j = 0; j <= i-1; j++) {
        if(n[i] == n[j]) {
          i--;
        }
      }
    }
    return n;
  }
  
  public Map<String, Object> getKey(int mno) {
    Map<String, Object> key = new HashMap<>();
    key.put("key", env.getProperty("tmdb.key"));
    key.put("mvnoList", anlyDao.getTopPNT(mno));
    /**
     * oneGr ?
     * 통계에서 가장 높은 장르 1개(2개?)
     */
    key.put("oneGr", 28);
    
    return key;
  }
}
