package com.luoamin.dao;


import com.luoamin.domain.Library;

import java.util.List;

/**
  * Copyright (c)2014,灵创智恒
  * All rights reserved.
  *
  * @file文件名
  * @date 2016-12-21 上午11:01:49
  * @brief
  * 对类进行详细描述
  *
  * @author dy
  */
public interface LibraryMapper {

	/**
	* 查询所有分类信息
	* @return
	*/
	public List<Library> findAllLibrary();

	/**
	* 根据id查询条数
	* @param id
	* @return
	*/
	public int findLibraryById(String id);

	/**
	* 查询最大排序号
	* @return
	*/
	public int findLastLibrary(Library library);


	public int deleteByPrimaryKey(String id);

	public int insert(Library library);

	public int updateByPrimaryKeySelective(Library library);

}
