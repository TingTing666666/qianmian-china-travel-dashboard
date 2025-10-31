"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ProjectPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // 合照轮播图片
  const heroImages = ['h1.JPG', 'h2.JPG', 'h3.JPG']
  
  // 采访照片
  const interviewImages = Array.from({ length: 15 }, (_, i) => `${i + 1}.jpg`)

  // 检测屏幕宽度
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  // 项目数据
  const projectData = {
    name: "千面中国游",
    englishName: "China Travel Project",
    mainSlogan: "千面中国，引领千万个故事，让世界看见，与世界交融",
    englishSlogan: "Travel China, Show China",
    productSlogan: "Travel China, Travel Pal",
    vision: "让外国游客更全面地看见中国，更从容地与真实的中国生活交融",
    missions: [
      "打破旧的刻板印象",
      "展示可亲、可爱、可敬的中国形象", 
      "搭建中国与世界的桥梁"
    ],
    positioning: "China Travel —— 一场关于深度探索中国的旅程",
    features: [
      "跨专业、多语言团队",
      "千面中国游数据库",
      "垂类大模型技术突破",
      "一站式旅行服务平台"
    ],
    keyData: [
      { label: "调查对象覆盖", value: "30余国" },
      { label: "外国旅客增长", value: "55.6%" },
      { label: "正向评论占比", value: "65%" },
      { label: "媒体报道阅读量", value: "百万+" }
    ],
    coreValue: {
      title: "Unexpectedly —— 意料之外的中国"
    },
    services: {
      forTravelers: ["旅行指南", "实时评价", "一站式服务"],
      forBusiness: ["个性化形象建构报告", "协助实现 Travel China, Show China"]
    },
    recognition: [
      "当代中国与世界研究院",
      "日本侨报出版社", 
      "上海文旅局",
      "人民网、环球网等主流媒体报道"
    ],
    partners: [
      "上海航空",
      "苏黎世中国传统文化协会",
      "等4家单位签订合作"
    ],
    achievements: [
      "2篇政府专报",
      "1项软件著作权",
      "自媒体账号运营（小红书等）"
    ],
    declaration: "作为青年一代，我们将继续怀抱初心，以千面中国引领千万个故事"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {isMobile ? <MobileProjectPage projectData={projectData} heroImages={heroImages} interviewImages={interviewImages} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} /> : <DesktopProjectPage projectData={projectData} heroImages={heroImages} interviewImages={interviewImages} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />}
    </div>
  )
}

// 手机专属页面组件
function MobileProjectPage({ projectData, heroImages, interviewImages, currentSlide, setCurrentSlide }) {
  return (
    <>
      {/* 手机版 Hero Section */}
      <section className="relative h-64 overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={`/${image}`}
                alt={`项目合照 ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
          ))}
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{projectData.name}</h1>
            <p className="text-sm opacity-90 mb-3">{projectData.englishName}</p>
            <div className="w-16 h-0.5 bg-purple-400 mx-auto rounded-full mb-3"></div>
            <p className="text-sm font-medium leading-relaxed">{projectData.mainSlogan}</p>
          </div>
        </div>

        {/* 轮播指示器 */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 手机版主要内容 */}
      <div className="px-4 py-6">
        
        {/* 核心价值 */}
        <section className="mb-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">核心价值主张</h2>
            <p className="text-purple-700 font-medium text-base">{projectData.coreValue.title}</p>
          </div>
        </section>

        {/* 项目愿景 */}
        <section className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">项目愿景</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{projectData.vision}</p>
          </div>
        </section>

        {/* 核心使命 */}
        <section className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">核心使命</h2>
            <div className="space-y-3">
              {projectData.missions.map((mission, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 text-sm leading-relaxed">{mission}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 关键数据 */}
        <section className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">关键数据</h2>
            <div className="grid grid-cols-2 gap-4">
              {projectData.keyData.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-purple-700">{data.value}</div>
                  <div className="text-xs text-gray-600 mt-1">{data.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 项目特色 */}
        <section className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">项目特色</h2>
            <div className="space-y-2">
              {projectData.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 采访照片 */}
        <section className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">采访瞬间</h2>
            <div className="grid grid-cols-2 gap-3">
              {interviewImages.slice(0, 6).map((image, index) => (
                <div key={image} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={`/${image}`}
                    alt={`采访照片 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-purple-600 text-sm font-medium border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
              查看更多照片
            </button>
          </div>
        </section>

        {/* 服务内容 */}
        <section className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">服务内容</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-2">对旅客</h3>
                <div className="space-y-1">
                  {projectData.services.forTravelers.map((service, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-2">对政府/企业</h3>
                <div className="space-y-1">
                  {projectData.services.forBusiness.map((service, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 认可与合作 */}
        <section className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">认可与合作</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-2">权威认可</h3>
                <div className="text-xs text-gray-600 leading-relaxed">
                  {projectData.recognition.join('、')}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-2">合作伙伴</h3>
                <div className="text-xs text-gray-600 leading-relaxed">
                  {projectData.partners.join('、')}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-2">项目成果</h3>
                <div className="text-xs text-gray-600 leading-relaxed">
                  {projectData.achievements.join('、')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 青年宣言 */}
        <section className="mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">青年宣言</h2>
            <p className="text-sm font-medium italic text-gray-800 text-center leading-relaxed">
              "{projectData.declaration}"
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

// 桌面版页面组件
function DesktopProjectPage({ projectData, heroImages, interviewImages, currentSlide, setCurrentSlide }) {
  return (
    <>
        {/* Hero Section with Carousel */}
        <section className="relative h-72 md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={`/${image}`}
                alt={`项目合照 ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {projectData.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-2 opacity-90">
              {projectData.englishName}
            </p>
            <div className="w-24 h-1 bg-purple-400 mx-auto rounded-full mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl font-medium">
              {projectData.mainSlogan}
            </p>
            <p className="text-sm sm:text-base md:text-lg mt-2 opacity-80">
              {projectData.englishSlogan}
            </p>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-7xl">
        
        {/* Editorial Overview */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          {/* Vision & Mission - editorial */}
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900">项目愿景与使命</h2>
            <div className="mt-3 w-12 h-[2px] bg-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-10 border-t border-purple-100 pt-6 sm:pt-8 lg:pt-10">
            <div className="grid md:grid-cols-7 gap-6 md:gap-10 items-start">
              <div className="md:col-span-3">
                <h3 className="text-xs uppercase tracking-widest text-purple-700">愿景</h3>
                <p className="mt-4 text-lg sm:text-xl leading-relaxed text-gray-800">{projectData.vision}</p>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-xs uppercase tracking-widest text-purple-700">使命</h3>
                <ol className="mt-4 space-y-4">
                  {projectData.missions.map((mission, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 leading-none mr-3 sm:mr-4">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="text-base sm:text-lg text-gray-800 leading-relaxed">{mission}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Core Positioning - minimal */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest text-purple-700">核心定位</span>
              <span className="h-px w-16 bg-purple-200"></span>
            </div>
            <p className="mt-6 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 px-4">{projectData.positioning}</p>
          </div>

          {/* Features & Key Stats - editorial */}
          <div className="mt-12 sm:mt-16 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Features - minimal list */}
            <div>
              <div className="text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900">项目特色</h2>
                <div className="mt-3 w-12 h-[2px] bg-purple-600 rounded-full"></div>
              </div>
              <ul className="mt-6 sm:mt-8 grid gap-y-3 gap-x-4 sm:gap-x-8">
                {projectData.features.map((feature, index) => (
                  <li key={index} className="flex items-baseline">
                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 flex-shrink-0 mt-2"></span>
                    <span className="text-sm sm:text-base text-gray-800">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key stats - large type without cards */}
            <div>
              <div className="text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900">关键数据亮点</h2>
                <div className="mt-3 w-12 h-[2px] bg-purple-600 rounded-full"></div>
              </div>
              <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {projectData.keyData.map((data, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700">{data.value}</div>
                    <div className="mt-1 text-xs sm:text-sm text-gray-600">{data.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Value - editorial (title only) */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900">核心价值主张</h2>
            <div className="mt-3 w-12 h-[2px] bg-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-10 border-t border-purple-100 pt-6 sm:pt-8 lg:pt-10">
            <div className="text-center">
              <h3 className="text-xs uppercase tracking-widest text-purple-700">主张</h3>
              <p className="mt-4 text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 px-4">{projectData.coreValue.title}</p>
            </div>
          </div>
        </section>

        {/* Interview Photos Gallery - multi-row horizontal scroll */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900">采访瞬间</h2>
            <div className="mt-3 w-12 h-[2px] bg-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-10">
            {/* 移动端：简单的网格布局 */}
            <div className="block sm:hidden">
              <div className="grid grid-cols-2 gap-3">
                {interviewImages.slice(0, 8).map((image, index) => (
                  <div key={image} className="relative h-32 rounded-lg overflow-hidden group">
                    <Image
                      src={`/${image}`}
                      alt={`采访照片 ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              {interviewImages.length > 8 && (
                <div className="mt-4 text-center">
                  <button className="text-purple-600 text-sm font-medium">查看更多照片</button>
                </div>
              )}
            </div>
            
            {/* 桌面端：原有的横向滚动布局 */}
            <div className="hidden sm:block overflow-x-auto snap-x snap-mandatory">
              <div className="grid grid-rows-1 md:grid-rows-2 grid-flow-col auto-cols-[280px] md:auto-cols-[220px] gap-4 pr-4">
                {interviewImages.map((image, index) => (
                  <div key={image} className="relative h-56 md:h-44 rounded-xl overflow-hidden snap-start group">
                    <Image
                      src={`/${image}`}
                      alt={`采访照片 ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services - editorial */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900">服务内容</h2>
            <div className="mt-3 w-12 h-[2px] bg-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-10 border-t border-purple-100 pt-6 sm:pt-8 lg:pt-10 grid md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-purple-700 mb-4">对旅客</h3>
              <ul className="space-y-3">
                {projectData.services.forTravelers.map((service, index) => (
                  <li key={index} className="flex items-baseline text-sm sm:text-base text-gray-800">
                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 flex-shrink-0 mt-2"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-purple-700 mb-4">对政府/企业</h3>
              <ul className="space-y-3">
                {projectData.services.forBusiness.map((service, index) => (
                  <li key={index} className="flex items-baseline text-sm sm:text-base text-gray-800">
                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 flex-shrink-0 mt-2"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Recognition & Partners - editorial */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900">认可与合作</h2>
            <div className="mt-3 w-12 h-[2px] bg-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-10 border-t border-purple-100 pt-6 sm:pt-8 lg:pt-10 grid md:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-purple-700 mb-4">权威认可</h3>
              <ul className="space-y-2">
                {projectData.recognition.map((item, index) => (
                  <li key={index} className="flex items-baseline text-sm sm:text-base text-gray-800">
                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 flex-shrink-0 mt-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-purple-700 mb-4">合作伙伴</h3>
              <ul className="space-y-2">
                {projectData.partners.map((partner, index) => (
                  <li key={index} className="flex items-baseline text-sm sm:text-base text-gray-800">
                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 flex-shrink-0 mt-2"></span>
                    {partner}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-purple-700 mb-4">项目成果</h3>
              <ul className="space-y-2">
                {projectData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-baseline text-sm sm:text-base text-gray-800">
                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 flex-shrink-0 mt-2"></span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Youth Declaration - minimal */}
        <section className="text-center">
          <div className="py-8 sm:py-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900">青年宣言</h2>
            <div className="mt-3 w-12 h-[2px] bg-purple-600 mx-auto rounded-full"></div>
            <p className="mt-6 text-lg sm:text-xl font-medium italic text-gray-800 px-4">"{projectData.declaration}"</p>
          </div>
        </section>
      </div>
    </>
  )
}