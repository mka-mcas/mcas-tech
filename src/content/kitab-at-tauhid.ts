export interface ContentSection {
  type: 'verse' | 'hadith';
  arabic: string;
  translation: string;
  reference?: string;
}

export interface ChapterData {
  id: number;
  title: string;
  subtitle: string;
  sections: ContentSection[];
  importantIssues: string[];
}

export const kitabChapters: ChapterData[] = [
  {
    id: 1,
    title: "At-Tauhid (The Oneness of Allah)",
    subtitle: "The ultimate cosmic objective of human and jinn creation",
    sections: [
      {
        type: "verse",
        arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
        translation: "\"And I (Allah) created not the Jinns and men except they should worship me (Alone).\"",
        reference: "Surah Adh-Dhariyat (51:56)"
      },
      {
        type: "verse",
        arabic: "وَلَقَدْ بَعَثْنَا فِي كُلِّ أُمَّةٍ رَّسُولًا أَنِ اعْبُدُوا اللَّهَ وَاجْتَنِبُوا الطَّاغُونَ",
        translation: "\"And verily, We have sent among every Ummah (community, nation) a Messenger (proclaiming): Worship Allah (Alone), and avoid (or keep away from) Taghut (all false deities worshipped besides Allah).\"",
        reference: "Surah An-Nahl (16:36)"
      },
      {
        type: "hadith",
        arabic: "يَا مُعَاذُ، أَتَدْرِي مَا حَقُّ اللَّهِ عَلَى الْعِبَادِ، وَمَا حَقُّ الْعِبَادِ عَلَى اللهِ؟... حَقُّ اللَّهِ عَلَى الْعِبَادِ أَنْ يَعْبُدُوهُ وَلَا يُشْرِكُوا بِهِ شَيْئًا",
        translation: "The Prophet said to Mu'adh bin Jabal: \"O Mu'adh, do you know what is the Right of Allah on his slaves and what is the right of the slaves upon Allah?\" I responded: \"Allah and His Messenger know best.\" He continued, \"The Right of Allah upon His slaves, is to worship Him Alone and never to associate anything with Him...\"",
        reference: "Sahih Al-Bukhari & Sahih Muslim"
      }
    ],
    importantIssues: [
      "Wisdom of Allah in creating Jinn and mankind.",
      "Worship is Tauhid, as in this issue there had always been dispute (between the Prophets and the polytheists).",
      "Those who have not fulfilled the requirements of Tauhid have not worshipped Allah properly.",
      "The paramount wisdom in sending Messengers across time.",
      "The message of Tauhid applies globally to all historical nations.",
      "All Prophets brought one and the same core foundational religion.",
      "Crucial realization: Worship of Allah cannot be truly performed until Taghut is explicitly denounced and rejected."
    ]
  },
  {
    id: 2,
    title: "The Superiority of Tauhid and What It Removes of Sins",
    subtitle: "The immense weight of monotheism on the scales of cosmic justice",
    sections: [
      {
        type: "verse",
        arabic: "الَّذِينَ آمَنُوا وَلَمْ يَلْبِسُوا إِيمَانَهُم بِظُلْمٍ أُولَئِكَ لَهُمُ الْأَمْنُ وَهُم مُّهْتَدُونَ",
        translation: "\"It is those who believe (in the Oneness of Allah and worship none but Him Alone) and confuse not their belief with Zulm (wrong, i.e. by committing Shirk), for them (only) there is security and they are the guided ones.\"",
        reference: "Surah Al-An'am (6:82)"
      },
      {
        type: "hadith",
        arabic: "لَوْ أَنَّ السَّمَوَاتِ السَّبْعَ وَعَامِرَهُنَّ غَيْرِي، وَالأَرَضِينَ السَّبْعَ فِي كِفَّةٍ، وَلَا إِلَهَ إِلَّا اللَّهُ فِي كِفَّةٍ، مَالَتْ بِهِنَّ لَا إِلَهَ إِلَّا اللَّهُ",
        translation: "The Prophet said: \"Musa (Moses) said: 'O my Rabb, teach me something through which I can remember You...' Allah answered: 'Say, O Musa, La ilaha illallah.' ... Allah said: 'O Musa, if the seven heavens and all they contain other than Me and the seven earths as well, were all put in one side of a scale and La ilaha illallah put in the other, the latter would overweigh them.'\"",
        reference: "Reported by Ibn Hibban & Al-Hakim"
      }
    ],
    importantIssues: [
      "The massive, limitless abundance of Allah's favor upon monotheists.",
      "The abundant reward of Tauhid towards structural redemption of actions.",
      "Besides earning rewards, pure Tauhid systematically expiates and removes sins.",
      "Proper comprehension of Surah Al-An'am Verse 82 regarding safety metrics.",
      "The realization that even prominent Prophets needed to be appraised of the profound structural weight of the Kalimah.",
      "True execution constitutes the absolute abandonment of Shirk practically, not merely confessing it casually with the tongue."
    ]
  }
];