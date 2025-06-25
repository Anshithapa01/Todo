package com.app.todo.service.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.app.todo.request.Datas;

@Service
public class DatabaseServiceImpl {
	
	public Datas[] getAllData(String url) {
		
		RestTemplate restTemp=new RestTemplate();
		Datas[] response=restTemp.getForObject(url, Datas[].class);
		return response;
	}
	
	public List<Datas> pagination(String url,int page,int size) {
		ArrayList<Datas> list=new ArrayList<>();
		Datas[] response=getAllData(url);
		for(int i=0;i<response.length;i++) {
			list.add(response[i]);
		}
		int start= (page-1)*size;
		int end= start+size;
		System.out.println(start);
		
		return list.subList(start, end);
	}

}
