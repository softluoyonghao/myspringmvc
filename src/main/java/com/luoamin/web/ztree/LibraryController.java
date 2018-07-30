package com.luoamin.web.ztree;

/**
  * Copyright (c)2014,灵创智恒
  * All rights reserved.
  *
  * @file文件名
  * @date 2016-12-21 上午11:58:46
  * @brief
  * 对类进行详细描述
  *
  * @author dy
  */

import com.luoamin.domain.Library;
import com.luoamin.service.impl.LibraryService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping(value = "/library/")
public class LibraryController {

	@Resource
	public LibraryService libraryService;

	/**
	* 跳转到分类页面
	* @return
	*/
	@RequestMapping(value = "toListLibrary")
	public String toListLibrary() {
		return "user/menexchange";
	}

	/**
	* 查询所有分类信息
	* @return
	*/
	@RequestMapping(value = "findAllLibrary")
	@ResponseBody
	public List<Object> findAllLibrary(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("ztree");
		List<Object> objects = libraryService.findAllLibrary();
		for (Object object : objects) {
			System.out.println("ssss" + object);
		}
		return libraryService.findAllLibrary();

	}

	/**
	* 保存分类
	* @return
	*/
	@RequestMapping(value = "saveLibrary")
	@ResponseBody
	public String saveLibrary(HttpServletRequest request, HttpServletResponse response) {
		String libraryId = UUID.randomUUID().toString();
		return libraryId;
	}

	/**
	* 更新分类名称
	* @return
	*/
	@RequestMapping(value = "updateLibraryName")
	@ResponseBody
	public String updateLibraryName(HttpServletRequest request, HttpServletResponse response, Library library) {
		//	String createname = (String) request.getSession().getAttribute(Constants.CURRENT_USER_NAME);
		String createname = "aa";
		library.setCreate_user(createname);
		library.setUpdate_user(createname);
		return libraryService.addOrUpdateLibrary(library);
	}

	/**
	* 删除分类
	* @return
	*/
	@RequestMapping(value = "deleteLibrary")
	@ResponseBody
	public String deleteLibrary(HttpServletRequest request, HttpServletResponse response, @RequestParam(value = "id") String id) {
		return libraryService.deleteLibrary(id);
	}
}
