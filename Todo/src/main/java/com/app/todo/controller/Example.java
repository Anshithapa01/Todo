package com.app.todo.controller;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Queue;
import java.util.Stack;

public class Example {
	
	public static void main(String[] args) {

		ArrayList<Integer> array=new ArrayList<>();
		array.add(22);
		array.add(20);
		array.add(28);
		array.add(26);
		array.add(21);
		array.get(3);
		Iterator<Integer> iterator=array.iterator();
		
		while(iterator.hasNext()) {
			System.out.println(iterator.next());
		}
    }
	

}
