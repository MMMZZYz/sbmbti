// 六个答题维度题库
// 每题 options 字段顺序就是显示顺序（A/B/C/D），type 为对应结果 key
const QUIZZES = {
  attachment: [
    { q: '好朋友突然两天没回你消息，你的第一反应是？', options: [
      { text: '是不是我说错什么了，反复翻聊天记录', type: 'anxious' },
      { text: '他最近可能比较忙，等他有空自然会回', type: 'secure' },
      { text: '又担心又不想表现得太在意，纠结要不要发消息', type: 'chaotic' },
      { text: '没事，我也不太想聊，互相清静', type: 'avoidant' },
    ]},
    { q: '和很喜欢的人越来越近，你会？', options: [
      { text: '莫名想保持点距离，太近了反而不舒服', type: 'avoidant' },
      { text: '又期待又想逃，自己都不知道自己要什么', type: 'chaotic' },
      { text: '顺其自然，感觉挺好的', type: 'secure' },
      { text: '开始患得患失，怕这种感觉突然消失', type: 'anxious' },
    ]},
    { q: '吵架后对方先道歉，你会？', options: [
      { text: '接受道歉，聊清楚然后和好', type: 'secure' },
      { text: '想和好又觉得哪里不对劲，和好了又开始担心下次', type: 'chaotic' },
      { text: '说没事了，但需要一个人待一会儿缓缓', type: 'avoidant' },
      { text: '接受但还是会反复想，他是真的在意我吗', type: 'anxious' },
    ]},
    { q: '你最害怕在关系里出现哪种情况？', options: [
      { text: '关系很好但总有一种随时会崩的不安全感', type: 'chaotic' },
      { text: '对方开始干涉我的个人空间和自由', type: 'avoidant' },
      { text: '对方喜欢我的程度没有我喜欢他多', type: 'anxious' },
      { text: '对方突然变冷淡但说不清原因', type: 'secure' },
    ]},
    { q: '朋友说"你最近好像有点疏远我"，你的感受是？', options: [
      { text: '认真回想一下，如果是真的就解释清楚', type: 'secure' },
      { text: '既觉得对方说得有道理，又觉得被逼近了想退开', type: 'chaotic' },
      { text: '立刻慌了，开始反思是不是自己哪里做得不够好', type: 'anxious' },
      { text: '有点不知所措，其实没有刻意疏远只是需要空间', type: 'avoidant' },
    ]},
    { q: '你独自旅行一周回来，最先想做的是？', options: [
      { text: '继续享受一个人的状态，不想立刻切换回去', type: 'avoidant' },
      { text: '想见人又觉得需要缓一缓，不知道先干什么', type: 'chaotic' },
      { text: '赶快看看有没有人找我，有没有错过什么', type: 'anxious' },
      { text: '和朋友分享这次旅行的故事', type: 'secure' },
    ]},
    { q: '对你很重要的人突然说要"保持距离冷静一下"，你会？', options: [
      { text: '表面说好，内心又慌又想逃，完全不知道怎么办', type: 'chaotic' },
      { text: '尊重对方的需要，给他空间，等他准备好', type: 'secure' },
      { text: '松了口气，其实自己也需要点空间', type: 'avoidant' },
      { text: '非常焦虑，忍不住想搞清楚到底发生了什么', type: 'anxious' },
    ]},
    { q: '你在一段关系里通常扮演哪种角色？', options: [
      { text: '我付出得更多，总担心对方不够在乎我', type: 'anxious' },
      { text: '说不清楚，每段关系都不一样，自己也搞不明白', type: 'chaotic' },
      { text: '对方付出得更多，我有时候觉得有点窒息', type: 'avoidant' },
      { text: '双方都在付出，比较平衡', type: 'secure' },
    ]},
    { q: '有人对你表白，但你对他感觉一般，你会？', options: [
      { text: '拒绝，然后下意识想保持距离', type: 'avoidant' },
      { text: '拒绝了但一直担心对方会不会难过', type: 'anxious' },
      { text: '直接说清楚，不让对方误会', type: 'secure' },
      { text: '拒绝了但又觉得愧疚，反而开始关心对方', type: 'chaotic' },
    ]},
    { q: '你理想中的关系状态是？', options: [
      { text: '说不清楚，想要亲密但真的亲密了又会不安', type: 'chaotic' },
      { text: '经常联系，对方能感受到我有多在乎他', type: 'anxious' },
      { text: '我们都有自己的生活，但彼此信任随时都在', type: 'secure' },
      { text: '各自独立，不需要时刻确认彼此的存在', type: 'avoidant' },
    ]},
    { q: '朋友在你最脆弱的时候靠近你，你会？', options: [
      { text: '一部分想让对方留下，一部分想把对方推开', type: 'chaotic' },
      { text: '感谢对方，但更想一个人处理', type: 'avoidant' },
      { text: '很感动，但同时担心自己表现得太狼狈', type: 'anxious' },
      { text: '接受，觉得被支持是件好事', type: 'secure' },
    ]},
    { q: '回顾你过去的重要关系，你觉得？', options: [
      { text: '很多关系最后都是因为我需要空间而疏远的', type: 'avoidant' },
      { text: '总是付出很多但总觉得不够安全，容易受伤', type: 'anxious' },
      { text: '每段关系都很复杂，自己在里面也很矛盾', type: 'chaotic' },
      { text: '大多数都比较健康，就算结束了也没有太多遗憾', type: 'secure' },
    ]},
  ],

  stress: [
    { q: '截止时间突然提前，你的第一反应是？', options: [
      { text: '先问问周围的人需不需要帮忙，把自己的事先放一放', type: 'fawn' },
      { text: '立刻重新规划，马上开始干', type: 'fight' },
      { text: '脑子一片空白，坐在那里动不了', type: 'freeze' },
      { text: '先离开一下，缓一缓再回来', type: 'flight' },
    ]},
    { q: '和重要的人发生了激烈冲突，你会？', options: [
      { text: '先走开冷静，等情绪平稳了再谈', type: 'flight' },
      { text: '先道歉，不管是不是自己的错', type: 'fawn' },
      { text: '愣在原地不知道说什么，脑子转不动', type: 'freeze' },
      { text: '直接说清楚自己的立场，不拖', type: 'fight' },
    ]},
    { q: '你同时收到三件麻烦事需要处理，你会？', options: [
      { text: '不知道从哪里开始，反而一件都没动', type: 'freeze' },
      { text: '先帮别人解决，自己的事最后再说', type: 'fawn' },
      { text: '列清单，逐个击破，越忙越清醒', type: 'fight' },
      { text: '先处理最重要的那件，其他的先不看', type: 'flight' },
    ]},
    { q: '你在公开场合说错了话，当场你会？', options: [
      { text: '瞬间僵住，脸红心跳，不知道怎么反应', type: 'freeze' },
      { text: '假装没事，事后找机会补救', type: 'flight' },
      { text: '马上道歉，担心别人因此不舒服', type: 'fawn' },
      { text: '立刻纠正，解释清楚', type: 'fight' },
    ]},
    { q: '你刚刚做了一个可能影响很大的决定，你会？', options: [
      { text: '反复回想，越想越焦虑，但又停不下来', type: 'freeze' },
      { text: '开始担心这个决定会不会影响到身边的人', type: 'fawn' },
      { text: '暂时不去想结果，先让自己平静下来', type: 'flight' },
      { text: '既然决定了就往前走，后悔没用', type: 'fight' },
    ]},
    { q: '突然被领导当众批评，你的反应是？', options: [
      { text: '先忍下来，私下再处理', type: 'flight' },
      { text: '脑子断线，说不出话，事后才想到该怎么回应', type: 'freeze' },
      { text: '当场说明情况，该争的要争', type: 'fight' },
      { text: '第一反应是道歉，先把气氛稳住再说', type: 'fawn' },
    ]},
    { q: '你正在休息，突然接到一个紧急任务，你会？', options: [
      { text: '先确认一下有没有人需要支援，再处理自己的部分', type: 'fawn' },
      { text: '立刻进入状态，压力反而让我更专注', type: 'fight' },
      { text: '明明要动但就是动不了，对着屏幕发呆', type: 'freeze' },
      { text: '先深呼吸，给自己五分钟再开始', type: 'flight' },
    ]},
    { q: '你最近压力很大，你通常怎么释放？', options: [
      { text: '运动、行动、把精力发泄出去', type: 'fight' },
      { text: '找朋友聊聊，或者帮别人做点事转移注意力', type: 'fawn' },
      { text: '什么都不想做，躺着刷手机发呆', type: 'freeze' },
      { text: '出去走走，离开压力源一段时间', type: 'flight' },
    ]},
    { q: '你发现一个重要项目出了问题，你会？', options: [
      { text: '先看看有没有人比我更需要帮助，再处理自己的问题', type: 'fawn' },
      { text: '脑子里警报大响但身体没动，一直在想但没有行动', type: 'freeze' },
      { text: '先冷静下来，想清楚再行动', type: 'flight' },
      { text: '马上找原因，立刻想解决方案', type: 'fight' },
    ]},
    { q: '你生活中压力最大的时候，身边人会看到你？', options: [
      { text: '反而更关心别人，把自己的情绪藏得很好', type: 'fawn' },
      { text: '明显变得迟钝，反应慢，像断电了一样', type: 'freeze' },
      { text: '突然消失一段时间，需要独处', type: 'flight' },
      { text: '比平时更忙更拼，停不下来', type: 'fight' },
    ]},
    { q: '你害怕的事情真的发生了，你的第一反应是？', options: [
      { text: '整个人卡住，脑子里反复转但没有任何行动', type: 'freeze' },
      { text: '第一时间想到的是这件事会不会影响到别人', type: 'fawn' },
      { text: '先接受现实，给自己时间消化', type: 'flight' },
      { text: '开始想怎么应对，进入解决模式', type: 'fight' },
    ]},
    { q: '回顾你面对压力的方式，你觉得自己是？', options: [
      { text: '需要先撤退一下，但撤完能回来继续', type: 'flight' },
      { text: '经常在该行动的时候卡住，事后才反应过来', type: 'freeze' },
      { text: '越有压力越清醒，压力是我的燃料', type: 'fight' },
      { text: '习惯先照顾好周围的人，最后才处理自己', type: 'fawn' },
    ]},
  ],

  social: [
    { q: '周五晚上，朋友临时约你出去聚会，你的感受是？', options: [
      { text: '去可以，但我更喜欢在旁边看大家聊', type: 'observer' },
      { text: '太好了，正好需要出去放电', type: 'social' },
      { text: '看看能不能把不同圈子的朋友都叫来', type: 'connector' },
      { text: '有点累，更想一个人待着', type: 'lone' },
    ]},
    { q: '一个你不认识的大型聚会，你通常会？', options: [
      { text: '到处认识新朋友，越多越好', type: 'social' },
      { text: '待一会儿就想走，人太多很耗能', type: 'lone' },
      { text: '找到几个有意思的人，把他们互相介绍', type: 'connector' },
      { text: '找个角落观察大家，偶尔加入聊天', type: 'observer' },
    ]},
    { q: '忙了一整周，周末你最想做的是？', options: [
      { text: '组织一个小聚会，把最近认识的人连接在一起', type: 'connector' },
      { text: '一个人待着，彻底充个电', type: 'lone' },
      { text: '约一堆朋友出去，好好放松', type: 'social' },
      { text: '喝杯咖啡，坐在咖啡馆观察来来往往的人', type: 'observer' },
    ]},
    { q: '在一个新环境里，你通常是？', options: [
      { text: '很快发现谁和谁应该认识，开始牵线搭桥', type: 'connector' },
      { text: '先观察，摸清楚每个人是什么样的再开口', type: 'observer' },
      { text: '很快就能融入，主动找人聊天', type: 'social' },
      { text: '需要时间热身，但熟了之后话很多', type: 'lone' },
    ]},
    { q: '朋友说你在社交场合里给他们的印象是？', options: [
      { text: '能量很高，带动整个场子', type: 'social' },
      { text: '总是知道在哪里，但不一定在聊天', type: 'observer' },
      { text: '需要充电，不在状态时会消失一段时间', type: 'lone' },
      { text: '喜欢把大家连在一起，像个枢纽', type: 'connector' },
    ]},
    { q: '一个你不太熟的人向你倾诉烦恼，你会？', options: [
      { text: '想想这个人和谁聊会更有帮助，帮他们连接', type: 'connector' },
      { text: '默默听完，不一定说很多但会记住细节', type: 'observer' },
      { text: '认真听，但事后需要独处一下恢复', type: 'lone' },
      { text: '很自然地加入，聊着聊着就熟了', type: 'social' },
    ]},
    { q: '你最享受哪种社交状态？', options: [
      { text: '两三个人的深度聊天', type: 'lone' },
      { text: '不同背景的人聚在一起，看他们碰撞出什么', type: 'connector' },
      { text: '安静地坐在一边，看着大家互动', type: 'observer' },
      { text: '热闹的大桌，所有人都在聊天', type: 'social' },
    ]},
    { q: '社交结束后，你通常感觉？', options: [
      { text: '充满能量，还想继续', type: 'social' },
      { text: '满足，特别是促成了什么连接的时候', type: 'connector' },
      { text: '有点累，需要一个人静一静', type: 'lone' },
      { text: '还好，但印象最深的是某个细节或某句话', type: 'observer' },
    ]},
    { q: '你在群里的状态通常是？', options: [
      { text: '活跃，经常发消息', type: 'social' },
      { text: '经常@人，把不同的人拉在一起讨论', type: 'connector' },
      { text: '不怎么说话，但私下会找人单独聊', type: 'lone' },
      { text: '潜水为主，偶尔冒泡', type: 'observer' },
    ]},
    { q: '一场你期待已久的聚会结束了，你第一个想做的是？', options: [
      { text: '回家，终于能一个人了', type: 'lone' },
      { text: '约下一场，意犹未尽', type: 'social' },
      { text: '想想把今天认识的哪几个人串起来', type: 'connector' },
      { text: '在脑子里回放今天某句触动到我的话', type: 'observer' },
    ]},
    { q: '你最不舒服的社交场景是？', options: [
      { text: '强迫我必须表态或者参与讨论', type: 'observer' },
      { text: '一群人各玩各的，没有任何连接和互动', type: 'connector' },
      { text: '被要求成为话题中心，所有人看着我', type: 'lone' },
      { text: '一个人坐着没人聊天，冷场', type: 'social' },
    ]},
    { q: '搬到新城市三个月，你的社交状态大概是？', options: [
      { text: '活动已经排满，认识了一堆新朋友', type: 'social' },
      { text: '有一两个走近了，其他的还在远处看着', type: 'lone' },
      { text: '已经把好几个不同圈子的人互相介绍过了', type: 'connector' },
      { text: '知道很多人的名字和习惯，但大多数人不太了解我', type: 'observer' },
    ]},
  ],

  script: [
    { q: '做一个团队项目，你最自然的角色是？', options: [
      { text: '默默把最难的部分做好，不需要被看见', type: 'support' },
      { text: '冲在最前面，带着大家往前走', type: 'lead' },
      { text: '提想法和框架，具体执行交给别人', type: 'writer' },
      { text: '在背后协调，确保每个人都在正确的位置', type: 'director' },
    ]},
    { q: '朋友遇到困难来找你，你通常？', options: [
      { text: '给他一个思路或者框架，让他自己去执行', type: 'writer' },
      { text: '帮他分析，然后陪他一起解决', type: 'lead' },
      { text: '默默做一些实际的事情，不说太多', type: 'support' },
      { text: '先想想谁能帮上忙，统筹安排', type: 'director' },
    ]},
    { q: '你理想中的成就感来自于？', options: [
      { text: '看到自己设计的系统顺畅运转', type: 'director' },
      { text: '亲自完成一件有影响力的事', type: 'lead' },
      { text: '自己的想法被人实现了，而且效果很好', type: 'writer' },
      { text: '知道某件事成功里有自己的一份力，哪怕没人知道', type: 'support' },
    ]},
    { q: '你最享受哪种被认可的方式？', options: [
      { text: '看到自己的想法被人引用或者传播', type: 'writer' },
      { text: '当众被表扬，大家都看到我的贡献', type: 'lead' },
      { text: '事情做成了，自己知道就够了', type: 'support' },
      { text: '被告知"没有你这件事不会成"', type: 'director' },
    ]},
    { q: '你在一段合作关系里最怕出现什么？', options: [
      { text: '想法被否定，或者根本没人听', type: 'writer' },
      { text: '失控，事情脱离了我的掌握', type: 'director' },
      { text: '被边缘化，感觉自己可有可无', type: 'lead' },
      { text: '付出被忽视，甚至被人抢功', type: 'support' },
    ]},
    { q: '你回顾自己过去做成的事，你通常觉得？', options: [
      { text: '是按照我当初设想的方向走的', type: 'writer' },
      { text: '是我带着大家做到的', type: 'lead' },
      { text: '里面有我很多付出，只是没人看见', type: 'support' },
      { text: '是我在背后推动的结果', type: 'director' },
    ]},
    { q: '一件大事做成了，庆功宴上你最想要的是？', options: [
      { text: '被推到前面，接受所有人的掌声', type: 'lead' },
      { text: '看着自己策划的一切顺利收尾，台前不台前都无所谓', type: 'director' },
      { text: '知道整个项目走的是自己最早提的那个方向', type: 'writer' },
      { text: '只要大家都在就够了，我做的那部分不需要被说出来', type: 'support' },
    ]},
    { q: '一件事搞砸了，你的第一反应是？', options: [
      { text: '反思最初的方案是不是有漏洞', type: 'writer' },
      { text: '我来收拾，这是我的责任', type: 'lead' },
      { text: '看看有没有人比我更需要帮助先稳住局面', type: 'support' },
      { text: '分析哪个环节出了问题，重新调整', type: 'director' },
    ]},
    { q: '你最有成就感的时刻是？', options: [
      { text: '悄悄帮了某人一把，他后来成功了', type: 'support' },
      { text: '站在台上，所有人看着我', type: 'lead' },
      { text: '自己写的东西或者想的框架被人传播', type: 'writer' },
      { text: '看到自己设计的东西被人用起来', type: 'director' },
    ]},
    { q: '你对"出名"这件事的态度是？', options: [
      { text: '不需要，做好自己该做的事就够了', type: 'support' },
      { text: '我不排斥，我值得被看见', type: 'lead' },
      { text: '我的想法出名比我本人出名更重要', type: 'writer' },
      { text: '不需要出名，但需要有影响力', type: 'director' },
    ]},
    { q: '你身边的人通常怎么描述你？', options: [
      { text: '像个军师，总在背后出谋划策', type: 'director' },
      { text: '有存在感，走到哪里都是焦点', type: 'lead' },
      { text: '可靠，关键时刻总会出现', type: 'support' },
      { text: '点子很多，脑子转得很快', type: 'writer' },
    ]},
    { q: '你最享受哪种局面？', options: [
      { text: '目标清晰，所有人跟着我往前冲', type: 'lead' },
      { text: '我构想的方向在别人手里落地了，比预期还好', type: 'writer' },
      { text: '前面的人不知道，但背后的线都是我串的', type: 'director' },
      { text: '默默做了一件很重要的事，但不需要被提起', type: 'support' },
    ]},
  ],

  humanDesign: [
    { q: '你做决定的时候，通常是怎么触发的？', options: [
      { text: '等到有什么事情来了，我自然知道该怎么回应', type: 'generator' },
      { text: '我想到了就直接去做，不需要等任何信号', type: 'manifestor' },
      { text: '需要时间观察整个环境，才能知道自己的感受', type: 'reflector' },
      { text: '等别人邀请我或者需要我，我再介入', type: 'projector' },
    ]},
    { q: '你的能量状态是？', options: [
      { text: '节省型的，不乱花力气，用在刀刃上', type: 'projector' },
      { text: '爆发式的，启动快但不一定能持续', type: 'manifestor' },
      { text: '像镜子，周围环境好我就好，环境差我就差', type: 'reflector' },
      { text: '持续稳定，只要做对的事情就有用不完的力气', type: 'generator' },
    ]},
    { q: '别人来找你帮忙，你通常？', options: [
      { text: '先感受一下对方的状态，再决定要不要介入', type: 'reflector' },
      { text: '先想想我能不能真正帮上忙，不确定就不轻易答应', type: 'projector' },
      { text: '直接评估能不能做，能做就干', type: 'manifestor' },
      { text: '要看我对这件事有没有感觉，有感觉才能做好', type: 'generator' },
    ]},
    { q: '你最有效率的工作状态是？', options: [
      { text: '被一件事吸引住，自然进入状态', type: 'generator' },
      { text: '环境对了，自然就顺了', type: 'reflector' },
      { text: '被人需要，有明确的邀请和期待', type: 'projector' },
      { text: '我说干就干，主动发起', type: 'manifestor' },
    ]},
    { q: '你觉得自己的价值最容易在哪里体现？', options: [
      { text: '开创新的东西，走别人没走过的路', type: 'manifestor' },
      { text: '如实反映一个群体或者环境的真实状态', type: 'reflector' },
      { text: '看见别人身上的潜力，帮他们找到方向', type: 'projector' },
      { text: '持续做一件事，慢慢看到成果', type: 'generator' },
    ]},
    { q: '你对"等待"这件事的感受是？', options: [
      { text: '习惯了，我知道等待邀请比强行介入效果更好', type: 'projector' },
      { text: '很难受，我更想主动出击', type: 'manifestor' },
      { text: '可以接受，等到对的时机比乱动更重要', type: 'generator' },
      { text: '取决于环境，环境对了等待也不难', type: 'reflector' },
    ]},
    { q: '你在一个新团队里，通常怎么找到自己的位置？', options: [
      { text: '主动宣示自己能做什么，让大家知道', type: 'manifestor' },
      { text: '先感受整个团队的氛围，再找到自己的位置', type: 'reflector' },
      { text: '观察每个人，等到有人真正需要我的洞察再出手', type: 'projector' },
      { text: '看看有什么事情需要我，自然会有感觉', type: 'generator' },
    ]},
    { q: '你觉得自己最大的天赋是？', options: [
      { text: '能感知，准确反映周围环境的真实状态', type: 'reflector' },
      { text: '能开创，敢于第一个行动', type: 'manifestor' },
      { text: '能看见，看见别人和系统里别人看不见的东西', type: 'projector' },
      { text: '能持续投入，把一件事做深做透', type: 'generator' },
    ]},
    { q: '你通常怎么知道一个决定是对的？', options: [
      { text: '看看周围的人和环境给我什么感觉', type: 'reflector' },
      { text: '等到有人认可我的判断，再去执行', type: 'projector' },
      { text: '想清楚了就做，不需要太多信号', type: 'manifestor' },
      { text: '身体有反应，感觉对了自然知道', type: 'generator' },
    ]},
    { q: '你最不舒服的状态是？', options: [
      { text: '没有人需要我，感觉自己可有可无', type: 'projector' },
      { text: '被迫做自己没感觉的事情', type: 'generator' },
      { text: '被人限制，没办法主动出击', type: 'manifestor' },
      { text: '处在一个混乱或者负能量很重的环境里', type: 'reflector' },
    ]},
    { q: '你对自己的人生节奏的感受是？', options: [
      { text: '我来定节奏，不喜欢被别人的节奏带着走', type: 'manifestor' },
      { text: '我的节奏跟着环境走，环境变我也变', type: 'reflector' },
      { text: '我需要顺势而为，强行推进只会更累', type: 'generator' },
      { text: '我需要等对的时机，急不来', type: 'projector' },
    ]},
    { q: '回顾你的行事方式，你更倾向于？', options: [
      { text: '持续投入一件事，慢慢积累', type: 'generator' },
      { text: '等到被需要，再发挥影响力', type: 'projector' },
      { text: '主动发起，让别人跟上我的节奏', type: 'manifestor' },
      { text: '随着环境调整自己，灵活应对', type: 'reflector' },
    ]},
  ],

  jung: [
    { q: '做一个重要决定的时候，你最先想到的是？', options: [
      { text: '这件事会对身边的人带来什么影响', type: 'emotion' },
      { text: '这件事能不能真的改变什么', type: 'power' },
      { text: '这件事之后，我会不会后悔没有试过', type: 'freedom' },
      { text: '这件事背后的逻辑站不站得住脚', type: 'wisdom' },
    ]},
    { q: '你最无法忍受的状态是？', options: [
      { text: '被困住，每天重复同样的生活', type: 'freedom' },
      { text: '孤立无援，身边没有真正在乎的人', type: 'emotion' },
      { text: '无能为力，眼睁睁看着事情变坏', type: 'power' },
      { text: '被蒙在鼓里，活在别人构建的幻觉里', type: 'wisdom' },
    ]},
    { q: '你在一个团队里最自然的贡献是？', options: [
      { text: '稳住团队的情绪，让大家感到被支持', type: 'emotion' },
      { text: '想清楚问题的本质，给出方向', type: 'wisdom' },
      { text: '带来新的视角和可能性，打破固有思路', type: 'freedom' },
      { text: '推动事情发生，让大家动起来', type: 'power' },
    ]},
    { q: '你最有成就感的时刻是？', options: [
      { text: '做了一件完全出乎意料的事，连自己都惊喜', type: 'freedom' },
      { text: '看到自己在意的人因为自己而变得更好', type: 'emotion' },
      { text: '克服了一个巨大的阻碍，证明了自己', type: 'power' },
      { text: '想通了一个复杂的问题，豁然开朗', type: 'wisdom' },
    ]},
    { q: '别人眼中你最鲜明的标签是？', options: [
      { text: '有个性，活得很像自己', type: 'freedom' },
      { text: '有力量，关键时刻靠得住', type: 'power' },
      { text: '有温度，让人觉得被照顾', type: 'emotion' },
      { text: '有深度，总能说出别人没想到的', type: 'wisdom' },
    ]},
    { q: '你对"冒险"的态度是？', options: [
      { text: '只要身边的人在，去哪里都不怕', type: 'emotion' },
      { text: '冒险本身就是目的，不需要理由', type: 'freedom' },
      { text: '值得的冒险我会全力以赴', type: 'power' },
      { text: '冒险前我需要想清楚为什么', type: 'wisdom' },
    ]},
    { q: '你最大的恐惧是？', options: [
      { text: '变得愚昧，失去判断力', type: 'wisdom' },
      { text: '变得冷漠，失去和别人的连接', type: 'emotion' },
      { text: '变得软弱，失去掌控', type: 'power' },
      { text: '变得平庸，活成大多数人', type: 'freedom' },
    ]},
    { q: '你理想中的人生是？', options: [
      { text: '身边的人因为有我而过得更好', type: 'emotion' },
      { text: '不断突破，越来越强，留下值得骄傲的成就', type: 'power' },
      { text: '越来越清醒，越来越接近真相', type: 'wisdom' },
      { text: '一直在路上，永远有新的东西等着我', type: 'freedom' },
    ]},
    { q: '你处理冲突的方式是？', options: [
      { text: '先照顾所有人的情绪，再解决问题', type: 'emotion' },
      { text: '先分析谁对谁错，再决定怎么做', type: 'wisdom' },
      { text: '绕开冲突，找另一条路', type: 'freedom' },
      { text: '直接面对，该争的要争', type: 'power' },
    ]},
    { q: '你对"意义"的理解是？', options: [
      { text: '意义是给予的，在帮助别人里找到自己', type: 'emotion' },
      { text: '意义是体验出来的，走过才知道', type: 'freedom' },
      { text: '意义是争来的，要付出代价才有价值', type: 'power' },
      { text: '意义是发现的，藏在事物的本质里', type: 'wisdom' },
    ]},
    { q: '你最享受哪种状态？', options: [
      { text: '全力投入一场硬仗，感觉自己在燃烧', type: 'power' },
      { text: '和真正在乎的人在一起，什么都不用做', type: 'emotion' },
      { text: '完全脱离日常，进入一种全新的体验', type: 'freedom' },
      { text: '一个人安静地想透一件事，感觉世界清晰了', type: 'wisdom' },
    ]},
    { q: '你在做一件自己真正相信的事，但遭遇了很大的阻力，你会？', options: [
      { text: '重新检验自己的判断，确认没有被情绪蒙蔽', type: 'wisdom' },
      { text: '更坚定，阻力越大说明这件事越值得', type: 'power' },
      { text: '先照顾好身边受影响的人，再想下一步', type: 'emotion' },
      { text: '重新找一条路，不一定非要走这条', type: 'freedom' },
    ]},
  ],
};

// MBTI 圆点量表题库（原创口语版）
// 每题：q 陈述；pos 同意时偏向的字母；neg 不同意时偏向的字母
// 选项 5 档（非常不同意 → 非常同意），权重 -2 ~ +2
const MBTI_QUIZ = [
  { q: '一堆人待久了，我不但不累，反而越来越来劲。', pos: 'E', neg: 'I' },
  { q: '我经常想着想着就飘到“以后会怎样”“万一……”上面去。', pos: 'N', neg: 'S' },
  { q: '做决定我先看道理通不通，谁会不高兴是其次。', pos: 'T', neg: 'F' },
  { q: '计划被临时打乱我会明显不爽，喜欢按部就班。', pos: 'J', neg: 'P' },

  { q: '有啥想法我习惯当场就说出来，边说边想。', pos: 'E', neg: 'I' },
  { q: '比起一件事具体怎么做，我更爱琢磨它到底意味着什么。', pos: 'N', neg: 'S' },
  { q: '朋友找我吐槽，我经常忍不住先帮他分析问题在哪。', pos: 'T', neg: 'F' },
  { q: '事情没定下来悬在那儿，我心里会一直惦记着。', pos: 'J', neg: 'P' },

  { q: '周末与其一个人宅着，我更想约人出去热闹一下。', pos: 'E', neg: 'I' },
  { q: '我脑子里点子一大堆，但落地执行常常是另一回事。', pos: 'N', neg: 'S' },
  { q: '就算是熟人，是非对错我也不太爱和稀泥。', pos: 'T', neg: 'F' },
  { q: '我习惯提前安排好，列清单、定计划让我安心。', pos: 'J', neg: 'P' },

  { q: '认识新朋友对我来说挺自然的，不太费劲。', pos: 'E', neg: 'I' },
  { q: '别人随口说件事，我容易自己脑补出一堆背后的可能。', pos: 'N', neg: 'S' },
  { q: '有人说过我太直、不太顾别人情绪。', pos: 'T', neg: 'F' },
  { q: '“先干了再说”我不太行，得先把步骤想清楚。', pos: 'J', neg: 'P' },
];

// 计算 MBTI：answers 为各题所选档位(0~4)，平局用兜底 I/N/F/P
function scoreMbti(answers) {
  const sum = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const axisOf = { E: 'EI', I: 'EI', N: 'SN', S: 'SN', T: 'TF', F: 'TF', J: 'JP', P: 'JP' };
  MBTI_QUIZ.forEach((item, i) => {
    const v = (answers[i] == null ? 2 : answers[i]) - 2; // -2 ~ +2，正=pos 方向
    sum[axisOf[item.pos]] += v;
  });
  const pick = (s, posL, negL, def) => (s > 0 ? posL : s < 0 ? negL : def);
  return (
    pick(sum.EI, 'E', 'I', 'I') +
    pick(sum.SN, 'N', 'S', 'N') +
    pick(sum.TF, 'T', 'F', 'F') +
    pick(sum.JP, 'J', 'P', 'P')
  );
}

// 计算答题结果：返回 { winner, counts }
//   winner: 票数最高的 type；平局时按各 type 在题库中的 type 字典序优先
//   counts: 每个 type 的票数（用于结果页绘制倾向条）
function calcQuizResult(answers) {
  const counts = {};
  answers.forEach(t => {
    counts[t] = (counts[t] || 0) + 1;
  });
  let winner = null;
  let best = -1;
  Object.keys(counts).sort().forEach(t => {
    if (counts[t] > best) {
      best = counts[t];
      winner = t;
    }
  });
  return { winner, counts };
}

module.exports = { QUIZZES, calcQuizResult, MBTI_QUIZ, scoreMbti };
