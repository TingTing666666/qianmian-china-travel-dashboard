/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\team\page.tsx
 */
"use client"

import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const students = [
    {
      id: 'mb1',
      name: '王欣颖',
      role: '项目负责人',
      major: '汉语言文学',
      achievements: [
        '第十九届"挑战杯"上海市大学生课外科技作品竞赛特等奖（负责人）',
        '上海大学"自强杯"决赛特等奖（负责人）',
        '上海大学2024年中国国际大学生创新大赛校级银奖（成员）',
        '上海大学寒假社会实践优秀先进个人',
        '上海大学"十佳团支书"、"优秀学生"、"百优团员"等十余项校级奖项',
        '上海大学学业一等奖学金、NITORI国际奖学金等多项国内外奖学金',
        '上海大学2023-2024学年冬季学期、2023-2024学年春季学期、2024-2025学秋季学期主题团日活动"活力团支部"称号（负责人）',
        '上海大学"走进人大"模拟人大常委会主题活动最佳议案（成员）'
      ],
      avatar: '/mb1.png'
    },
    {
      id: 'mb2',
      name: '张听',
      role: '团队成员',
      major: '计算机科学与技术',
      achievements: [
        '华为昇思创新训练营二等奖',
        '"梧桐杯"大数据创新大赛省级一等奖'
      ],
      avatar: '/mb2.png'
    },
    {
      id: 'mb3',
      name: '卫怡梵',
      role: '团队成员',
      major: '网络与新媒体',
      achievements: [
        '2024年全球青年领导力项目并获得优秀学员',
        '2023年全球企业传播峰会论文优秀奖'
      ],
      avatar: '/mb3.png'
    },
    {
      id: 'mb4',
      name: '邓修杰',
      role: '团队成员',
      major: '日语',
      achievements: [
        '上海大学主持人社社长',
        '上海市挑战杯特等奖',
        '国家级项目负责人'
      ],
      avatar: '/mb4.png'
    },
    {
      id: 'mb5',
      name: '顾伊晨',
      role: '团队成员',
      major: '汉语言文学',
      achievements: [
        '上海市挑战杯特等奖',
        '2024年大学生创新创业大赛上海市级立项'
      ],
      avatar: '/mb5.png'
    },
    {
      id: 'mb6',
      name: '朱紫奕',
      role: '团队成员',
      major: '社会学',
      achievements: [
        '校级优秀学生、学优之星',
        '校自强杯竞赛特等奖',
        '第十五届挑战杯上海市特等奖'
      ],
      avatar: '/mb6.png'
    }
  ]

const teachers = [
    {
      id: 'tch1',
      name: '刘旭光',
      title: '上海大学教授、博士生导师',
      department: '上海大学文学院院长',
      achievements: [
        '国家哲社重大项目首席专家',
        '上海市"曙光学者"(2011)',
        '马工程《西方美学史》专家组成员',
        '主要学术兼职：中华美学会常务理事，中国文艺理论学会理事、中外文艺理论学会理事，中国美术家协会会员，上海美术家协会理事'
      ],
      avatar: '/tch1.png'
    },
    {
      id: 'tch2',
      name: '汪雨萌',
      title: '复旦大学中文系博士',
      department: '现任职于上海大学中文系创意写作中心',
      achievements: [
        '主要研究方向：中国现当代文学批评与研究，创意写作教学与研究',
        '曾在《南方文坛》《当代作家评论》《文艺争鸣》《江苏社会科学》等中文核心期刊等发表文学评论及学术论文二十余篇'
      ],
      avatar: '/tch2.png'
    },
    {
      id: 'tch3',
      name: '苏鹰',
      title: '广东外语外贸大学博士、北京外国语大学博士后、日本千叶大学访问学者',
      department: '上海大学教授、硕士生导师、博士生导师',
      achievements: [
        '主要研究方向：日语语言学、汉日语言对比、第二语言习得',
        '兼任社会任职：中华日本学会理事；汉日对比语言学研究（协作）会常务理事、编辑委员会副委员长等'
      ],
      avatar: '/tch3.png'
    }
  ]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* 页面标题 */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-wide">
            团队介绍
          </h1>
          <div className="w-24 h-0.5 bg-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            我们是一支专业的数据科学团队，致力于通过技术创新推动旅游行业的数字化发展
          </p>
        </div>

        {/* 项目负责人 */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">项目负责人</h2>
            <div className="w-16 h-0.5 bg-purple-600 mx-auto"></div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-white overflow-hidden">
              <CardContent className="p-12">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                      <Image
                        src={students[0].avatar}
                        alt={students[0].name}
                        width={180}
                        height={180}
                        className="rounded-full"
                      />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      负责人
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left space-y-6">
                    <div>
                      <h3 className="text-4xl font-light text-gray-900 mb-2">{students[0].name}</h3>
                      <p className="text-xl text-purple-600 font-medium mb-1">{students[0].major}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      {students[0].achievements.map((achievement, index) => (
                        <Badge key={index} className="bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 text-sm font-medium">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 团队成员 */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">团队成员</h2>
            <div className="w-16 h-0.5 bg-purple-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.slice(1).map((student) => (
              <Card key={student.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mx-auto">
                    <Image
                      src={student.avatar}
                      alt={student.name}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-light text-gray-900 mb-2">{student.name}</h3>
                    <p className="text-lg text-purple-600 font-medium mb-1">{student.role}</p>
                    <p className="text-base text-gray-500 mb-1">{student.major}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {student.achievements.slice(0, 3).map((achievement, achIndex) => (
                      <Badge key={achIndex} className="bg-gray-50 text-gray-600 border border-gray-200 text-xs px-3 py-1">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 指导老师 */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">指导老师</h2>
            <div className="w-16 h-0.5 bg-purple-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
                    <Image
                      src={teacher.avatar}
                      alt={teacher.name}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-light text-gray-900 mb-2">{teacher.name}</h3>
                    <p className="text-lg text-purple-600 font-medium mb-1">{teacher.title}</p>
                    <p className="text-base text-gray-600 mb-1">{teacher.department}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {teacher.achievements.slice(0, 3).map((achievement, achIndex) => (
                      <Badge key={achIndex} className="bg-purple-100 text-purple-700 border border-purple-200 text-xs px-3 py-1">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}