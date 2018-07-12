package com.luoamin.service.impl;

import com.luoamin.dao.conutry.CountryMapper;
import com.luoamin.service.CountryService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by Administrator on 2018/6/25.
 */
@Service
public class CountryServiceImpl implements CountryService{
    @Resource
    private CountryMapper countryMappery;
    @Override
    public void delete(int id) {
        countryMappery.delete(id);
    }
}
