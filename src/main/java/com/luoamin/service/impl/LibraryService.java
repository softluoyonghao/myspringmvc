package com.luoamin.service.impl;

import com.luoamin.dao.LibraryMapper;
import com.luoamin.domain.Library;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
  * Copyright (c)2014,灵创智恒
  * All rights reserved.
  *
  * @file文件名
  * @date 2016-12-21 上午11:50:19
  * @brief
  * 对类进行详细描述
  *
  * @author dy
  */

@Service
public class LibraryService {
	protected final static Log log = LogFactory.getLog(LibraryService.class);

	@Resource
	private LibraryMapper libraryMapper;

	/**
	* 查询所有分类信息
	* @return
	*/
	public List<Object> findAllLibrary() {
		List<Object> listZTree = new ArrayList<Object>();
		List<Library> listLibrary = libraryMapper.findAllLibrary();
		String str = "";
		for (int i = 0; i < listLibrary.size(); i++) {
			Library library = listLibrary.get(i);//分类信息
			str = "{id:'" + library.getId() + "', pId:'" + library.getPid() + "', name:\"" + library.getName() + "\" }";//封装ztree需要格式的字符串
			log.info(str);
			listZTree.add(str);
		}
		return listZTree;
	}

	/**
	* 保存或更新分类信息
	* @param library
	* @return
	*/
	public String addOrUpdateLibrary(Library library) {
		System.out.println("到这儿");
		int numFlag = 0;
		//根据id查询分类信息
		if (StringUtils.isBlank(library.getId())) {
			return "error";
		}
		int num = libraryMapper.findLibraryById(library.getId());
		if (num > 0) {//更新信息
			library.setUpdate_time(new Date());
			library.setIs_delete(1);

			//library.setCreate_user(null);
			//library.setPid(null);
			numFlag = libraryMapper.updateByPrimaryKeySelective(library);
		} else {//插入信息
			if (library.getPid().equals("null")) {
				library.setPid("0");
			}
			//int orderId = libraryMapper.findLastLibrary(library);
			//	orderId++;
			library.setCreate_time(new Date());
			library.setUpdate_time(new Date());
			library.setIs_delete(1);
			//	library.setOrder_id(orderId);
			numFlag = libraryMapper.insert(library);
		}
		return "success";
	}

	/**
	* 删除分类
	* @param id
	* @return
	*/
	public String deleteLibrary(String id) {
		int num = libraryMapper.deleteByPrimaryKey(id);
		return "success";
	}

}
