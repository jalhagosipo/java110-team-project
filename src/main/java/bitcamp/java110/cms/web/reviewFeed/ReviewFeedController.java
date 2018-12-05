package bitcamp.java110.cms.web.reviewFeed;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import bitcamp.java110.cms.common.Constants;
import bitcamp.java110.cms.dao.MovieAnlyDao;
import bitcamp.java110.cms.domain.Member;
import bitcamp.java110.cms.domain.Post;
import bitcamp.java110.cms.domain.PostCmt;
import bitcamp.java110.cms.service.FlwService;
import bitcamp.java110.cms.service.LikeService;
import bitcamp.java110.cms.service.MemberService;
import bitcamp.java110.cms.service.PostService;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.model.core.MovieResultsPage;

@Controller
@RequestMapping("/reviewFeed")
public class ReviewFeedController {

  @Autowired MemberService memberService;
  @Autowired PostService postService; 
  @Autowired ServletContext sc;
  @Autowired FlwService flwService;
  @Autowired TmdbMovies tmdbMovies;
  @Autowired LikeService likeService;
  @Autowired MovieAnlyDao anlyDao;

  // 처음 피드리스트화면에 들어갔을 때  
  @RequestMapping("/list")
  public String list(
      Post post,
      Model model,
      HttpSession session)  throws Exception {

    Member member = (Member) session.getAttribute("loginUser");

    if(member != null) {
      List<Member> flwList = flwService.listAll(member.getMno());
      model.addAttribute("userFlwList", flwList); // 로그인한사람의 팔로우리스트저장

      MovieResultsPage smlrList;
      do {
      int triggerMvId = anlyDao.getOneFav(member.getMno());
      smlrList =  tmdbMovies.getSimilarMovies(triggerMvId, Constants.LANGUAGE_KO, 1);
      }while(smlrList.getResults().size()>0);
      
      model.addAttribute("smlrList", smlrList.getResults());
    }

    Map<String, Object> params = new HashMap<>();
    params.put("mno", (member==null)?0:member.getMno());
    params.put("prevpstno", "x");

    model.addAttribute("postList", postService.getPosts(params));

    return "reviewFeed/reviewFeedList";
  }

  // 피드 무한스크롤
  @RequestMapping("morePost")
  @ResponseBody
  public Object morePost(
      @RequestBody Map<String, Object> request,
      HttpSession session) throws Exception {
    Member member = (Member)session.getAttribute("loginUser");

    Map<String, Object> resultMap = new HashMap<>();
    int pstno = Integer.valueOf((String)request.get("pstno"));

    Map<String, Object> params = new HashMap<>();
    params.put("mno", (member==null)?0:member.getMno());
    params.put("prevpstno", pstno);

    List<Post> postsResult = postService.getPosts(params); 
    resultMap.put("postsResult", postsResult);
    return resultMap;
  }

  // 댓글 추가
  @PostMapping("addCmt")
  public @ResponseBody void addCmt(PostCmt comment,
      HttpSession session) throws Exception {

    Member member = (Member)session.getAttribute("loginUser");
    comment.setMno(member.getMno());

    postService.addCmt(comment);
  }

  // 댓글 삭제
  @RequestMapping("deleteCmt")
  public @ResponseBody void deleteCmt(@RequestBody Map<String, Object> request) {
    int pcno = Integer.valueOf((String)request.get("pcno"));
    postService.deleteCmt(pcno);
  }

  // 댓글 수정
  @RequestMapping("editCmt")
  public @ResponseBody void editComment(@RequestBody Map<String, Object> request) {
    int pcno = Integer.valueOf((String)request.get("pcno"));

    PostCmt postCmt = new PostCmt();
    postCmt.setContent((String)request.get("content"));
    postCmt.setPcno(pcno);
    postService.updateCmt(postCmt);

  }

  // 댓글 목록
  @RequestMapping("listCmt")
  public @ResponseBody Map<String, Object> listCmt(
      @RequestBody Map<String, Object> request,
      HttpSession session) throws Exception {

    Map<String, Object> resultMap = new HashMap<>();
    int pstno = Integer.valueOf((String)request.get("pstno"));
    List<PostCmt> cmtsResult = postService.getCmts(pstno);
    resultMap.put("cmtsResult", cmtsResult);
    return resultMap;
  }

  // 좋아요 추가
  @RequestMapping("addLike")
  public @ResponseBody int addLike(
      HttpSession session, int pstno, int pstTypeNo) {

    int mno = ((Member)session.getAttribute("loginUser")).getMno();
    likeService.addLike(pstno, (pstTypeNo==0)?Constants.LOG_DO_TYPE_MP:Constants.LOG_DO_TYPE_DP, mno);
    return likeService.listLike(pstno, (pstTypeNo==0)?Constants.LOG_DO_TYPE_MP:Constants.LOG_DO_TYPE_DP).size();
  }

  // 좋아요 취소
  @RequestMapping("cancelLike")
  public @ResponseBody int cancelLike(
      HttpSession session, int pstno, int pstTypeNo) {

    int mno = ((Member)session.getAttribute("loginUser")).getMno();
    likeService.cancelLike(pstno, (pstTypeNo==0)?Constants.LOG_DO_TYPE_MP:Constants.LOG_DO_TYPE_DP, mno);
    return likeService.listLike(pstno, (pstTypeNo==0)?Constants.LOG_DO_TYPE_MP:Constants.LOG_DO_TYPE_DP).size();
  }

  // 포스트 추가
  @PostMapping("/add")
  public String add(
      Post post,
      String fileNames,
      HttpSession session,
      HttpServletRequest request) throws Exception {

    Member m = (Member)session.getAttribute("loginUser");
    post.setMno(m.getMno());

    // 사진 데이터 처리
    String[] fileList = fileNames.split(",");
    List<String> filens = new ArrayList<>();
    
    for(int i=0;i<fileList.length;i++) {
      String file = fileList[i];
      if(file.length() > 0) {
        filens.add(file);
      }
    }
    post.setPhotos(filens);
    
    postService.addPost(post);

    String originPath = request.getHeader("referer");
    return "redirect:" + originPath.substring(
        originPath.indexOf("/app"));
  }

  // 포스트 가져오기
  @RequestMapping("/editor")
  public @ResponseBody Post edit (int postId) {
    return postService.getOnePost(postId);
  }

  // 포스트 수정
  @RequestMapping("/update")
  public String updatePost (
      Post post,
      MultipartFile[] files,
      HttpSession session,
      HttpServletRequest request) throws Exception {

    String originPath = request.getHeader("referer");
    return "redirect:" + originPath.substring(
        originPath.indexOf("/app"));
  }

  // 포스트 삭제
  @RequestMapping("/delete")
  public String delete (
      int postId,
      HttpServletRequest request) {
    postService.deletePost(postId);

    String originPath = request.getHeader("referer");
    return "redirect:" + originPath.substring(
        originPath.indexOf("/app"));
  }

  // 마이페이지-피드
  @RequestMapping("/Feed")
  public String Feed(
      Post post,
      Model model,
      int id,
      HttpSession session) {
    Map<String, Object> params = new HashMap<>();
    
    Member m = ((Member)session.getAttribute("loginUser"));
    
    //  비로그인 방문자도 피드 내용을 볼수 있도록 하는 코드.
    int visitor;
    if(m != null) {
      visitor = m.getMno();
    } else {
      visitor = 0;
    }
    
    model.addAttribute("targetUser", memberService.findByMno(id));

    List<Post> list = null;
    if(visitor == id) {
      params.put("prevpstno", "owner");
      params.put("mno", id);
      list = postService.getPosts(params);
    } else {
      params.put("prevpstno", "visitor");
      params.put("mno", id);
      list = postService.getPosts(params);
    }
    model.addAttribute("postList", list);
    return "include/Feed";
  }
  
  // 파일 업로드
  @RequestMapping("/fileUpload-upload")
  public @ResponseBody List<String> upload (
      MultipartFile[] files) throws Exception {
    
    List<String> filenames = new ArrayList<>();
    for(int i=0;i<files.length;i++) {
      MultipartFile file = files[i];
      if (file.getSize() > 0) {
        String filename = UUID.randomUUID().toString();
        file.transferTo(new File(sc.getRealPath("/upload/post/" + filename)));
        filenames.add(filename);
      }
    }
    
    return filenames;
  }
  
  // 파일 삭제
  @RequestMapping("/fileUpload-remove")
  public @ResponseBody boolean removeFile(
      String fileName) {
    File targetFile = new File(sc.getRealPath("/upload/post/" + fileName));
    if (targetFile.exists()) {
      return targetFile.delete();
    }
    return false;
  }
}