// Privacy policy, terms of use and cookie notice. English, Uzbek and Russian; other languages show English.
// Each document: { title, updated, sections: [[heading, text], …] }.

const UPDATED = '2026-10-01'
const EMAIL = 'travelmatee@gmail.com'

export const legalDocs = ['privacy', 'terms', 'cookies']

const en = {
  privacy: {
    title: 'Privacy policy',
    sections: [
      ['Who we are', `TravelMate is a travel booking platform for Uzbekistan, operated from Tashkent. Contact: ${EMAIL}, +998 91 655 01 12.`],
      ['What we collect', 'Account data: your name, email address and, if you sign in with Google, your Google profile photo. Booking data: the services you book, dates, prices and the contact details you enter for a booking (name, phone, email). Technical data: your language, theme and recent searches are stored only in your browser.'],
      ['Why we use it', 'To create and secure your account, to show and manage your bookings, to pass your booking to the hotel, guide, driver or operator who provides the service, and to answer your support requests. We do not sell your data and we do not use it for third-party advertising.'],
      ['Who processes it', 'Neon (database and sign-in), Vercel (hosting), Google (only if you choose Google sign-in) and Google Gemini (questions you type into TravelMate AI are sent to it to generate an answer — do not type personal data there). Service providers receive only the details needed for your booking.'],
      ['How long we keep it', 'Account and booking data are kept while your account is active. You can ask us to delete your account and all related data at any time by writing to ' + EMAIL + '; we do so within 30 days.'],
      ['Your rights', 'You can request a copy of your data, correct it, or have it deleted. Write to ' + EMAIL + ' from the email address of your account.'],
      ['Security', 'Passwords are handled by our sign-in provider and are never stored in your browser or in our own tables. Sessions use a secure, HttpOnly cookie.'],
    ],
  },
  terms: {
    title: 'Terms of use',
    sections: [
      ['The service', 'TravelMate helps you find and book travel services in Uzbekistan: hotels, guides, transfers, tickets, tours, eSIM plans and more. The service itself is provided by the hotel, guide, driver, carrier or operator named on the offer.'],
      ['Prices', 'Prices are shown in US dollars with an indicative so’m equivalent. The so’m amount follows the daily exchange rate and may change slightly. The price shown when you book is the price you pay; there are no hidden service fees.'],
      ['Bookings and cancellation', 'A booking is confirmed when it appears in My profile → My bookings. Transfers can be cancelled free of charge up to 24 hours before pick-up. Hotels, tours and tickets follow the cancellation policy shown on their page. Tour packages require a 30% deposit; the balance is due 14 days before the start.'],
      ['Your account', 'Keep your sign-in details private and give correct contact information so providers can reach you. We may suspend accounts used for fraud or abuse.'],
      ['Responsibility', 'We check our partners before listing them, but each provider is responsible for the service it delivers. If something goes wrong, contact us and we will help resolve it with the provider.'],
      ['Law', 'These terms are governed by the laws of the Republic of Uzbekistan. Questions: ' + EMAIL + '.'],
    ],
  },
  cookies: {
    title: 'Cookie notice',
    sections: [
      ['Necessary cookie', 'tm_session — keeps you signed in (HttpOnly, secure, 30 days). Without it you cannot book.'],
      ['Sign-in provider', 'When you sign in, our sign-in provider (Neon Auth) may set its own session cookie on its domain to complete the sign-in.'],
      ['Browser storage', 'Your language, colour theme, recent searches and a chat history for the current tab are stored in your browser only and never sent to us.'],
      ['No advertising cookies', 'TravelMate does not use advertising or cross-site tracking cookies.'],
    ],
  },
}

const uz = {
  privacy: {
    title: 'Maxfiylik siyosati',
    sections: [
      ['Biz kimmiz', `TravelMate — O'zbekiston bo'ylab sayohatlarni bron qilish platformasi, Toshkentdan boshqariladi. Aloqa: ${EMAIL}, +998 91 655 01 12.`],
      ["Qanday ma'lumot to'playmiz", "Akkaunt ma'lumotlari: ismingiz, email manzilingiz va Google orqali kirsangiz — Google profil rasmingiz. Bron ma'lumotlari: bron qilgan xizmatlaringiz, sanalar, narxlar va bron uchun kiritgan aloqa ma'lumotlaringiz (ism, telefon, email). Texnik ma'lumotlar: til, mavzu va oxirgi qidiruvlar faqat brauzeringizda saqlanadi."],
      ['Nima uchun ishlatamiz', "Akkauntingizni yaratish va himoya qilish, bronlaringizni ko'rsatish va boshqarish, broningizni xizmatni ko'rsatadigan mehmonxona, gid, haydovchi yoki operatorga yetkazish va murojaatlaringizga javob berish uchun. Ma'lumotlaringizni sotmaymiz va uchinchi tomon reklamasi uchun ishlatmaymiz."],
      ["Kim qayta ishlaydi", "Neon (ma'lumotlar bazasi va kirish), Vercel (hosting), Google (faqat Google orqali kirsangiz) va Google Gemini (TravelMate AI'ga yozgan savollaringiz javob olish uchun unga yuboriladi — u yerga shaxsiy ma'lumot yozmang). Xizmat ko'rsatuvchilar faqat bron uchun kerakli ma'lumotni oladi."],
      ['Qancha saqlaymiz', `Akkaunt va bron ma'lumotlari akkauntingiz faol ekan saqlanadi. Istalgan vaqtda ${EMAIL} ga yozib akkauntingiz va barcha ma'lumotlaringizni o'chirishni so'rashingiz mumkin; 30 kun ichida o'chiramiz.`],
      ['Huquqlaringiz', `Ma'lumotlaringiz nusxasini olish, tuzatish yoki o'chirishni so'rashingiz mumkin. Akkauntingiz emailidan ${EMAIL} ga yozing.`],
      ['Xavfsizlik', "Parollar kirish provayderimiz tomonidan qayta ishlanadi va hech qachon brauzeringizda yoki bizning jadvallarimizda saqlanmaydi. Sessiyalar xavfsiz HttpOnly cookie orqali ishlaydi."],
    ],
  },
  terms: {
    title: 'Foydalanish shartlari',
    sections: [
      ['Xizmat', "TravelMate O'zbekistonda sayohat xizmatlarini topish va bron qilishga yordam beradi: mehmonxonalar, gidlar, transferlar, chiptalar, turlar, eSIM va boshqalar. Xizmatning o'zini taklifda ko'rsatilgan mehmonxona, gid, haydovchi, tashuvchi yoki operator ko'rsatadi."],
      ['Narxlar', "Narxlar AQSh dollarida va so'mdagi taxminiy ekvivalenti bilan ko'rsatiladi. So'mdagi summa kunlik kursga bog'liq va biroz o'zgarishi mumkin. Bron paytida ko'rsatilgan narx — siz to'laydigan narx; yashirin to'lovlar yo'q."],
      ['Bron va bekor qilish', "Bron Profil → Mening bronlarim bo'limida paydo bo'lganda tasdiqlangan hisoblanadi. Transferlarni olib ketishdan 24 soat oldingacha bepul bekor qilish mumkin. Mehmonxona, tur va chiptalar o'z sahifasidagi qoidaga amal qiladi. Tur paketlari uchun 30% oldindan to'lov, qolgani boshlanishdan 14 kun oldin."],
      ['Akkauntingiz', "Kirish ma'lumotlaringizni sir saqlang va xizmat ko'rsatuvchilar siz bilan bog'lana olishi uchun to'g'ri aloqa ma'lumotlarini kiriting. Firibgarlik yoki suiiste'mol uchun ishlatilgan akkauntlarni to'xtatishimiz mumkin."],
      ["Mas'uliyat", "Hamkorlarimizni ro'yxatga qo'shishdan oldin tekshiramiz, ammo har bir xizmat ko'rsatuvchi o'z xizmati uchun javobgar. Muammo bo'lsa, biz bilan bog'laning — xizmat ko'rsatuvchi bilan hal qilishga yordam beramiz."],
      ['Qonunchilik', `Ushbu shartlar O'zbekiston Respublikasi qonunlariga bo'ysunadi. Savollar: ${EMAIL}.`],
    ],
  },
  cookies: {
    title: 'Cookie haqida',
    sections: [
      ['Zarur cookie', "tm_session — sizni tizimda saqlaydi (HttpOnly, xavfsiz, 30 kun). Usiz bron qilib bo'lmaydi."],
      ['Kirish provayderi', "Kirayotganingizda kirish provayderimiz (Neon Auth) kirishni yakunlash uchun o'z domenida sessiya cookie o'rnatishi mumkin."],
      ['Brauzer xotirasi', "Til, rang mavzusi, oxirgi qidiruvlar va joriy oynadagi chat tarixi faqat brauzeringizda saqlanadi va bizga yuborilmaydi."],
      ["Reklama cookie'lari yo'q", "TravelMate reklama yoki saytlararo kuzatuv cookie'laridan foydalanmaydi."],
    ],
  },
}

const ru = {
  privacy: {
    title: 'Политика конфиденциальности',
    sections: [
      ['Кто мы', `TravelMate — платформа бронирования путешествий по Узбекистану, работает из Ташкента. Контакты: ${EMAIL}, +998 91 655 01 12.`],
      ['Какие данные мы собираем', 'Данные аккаунта: имя, email и, если вы входите через Google, фото профиля Google. Данные бронирований: забронированные услуги, даты, цены и контакты, которые вы указали для брони (имя, телефон, email). Технические данные: язык, тема и последние поиски хранятся только в вашем браузере.'],
      ['Зачем мы их используем', 'Чтобы создать и защитить аккаунт, показывать и вести ваши бронирования, передать бронь отелю, гиду, водителю или оператору, который оказывает услугу, и отвечать на обращения. Мы не продаём ваши данные и не используем их для сторонней рекламы.'],
      ['Кто их обрабатывает', 'Neon (база данных и вход), Vercel (хостинг), Google (только при входе через Google) и Google Gemini (вопросы в TravelMate AI отправляются ему для ответа — не пишите туда личные данные). Поставщики услуг получают только то, что нужно для брони.'],
      ['Сколько мы храним', `Данные аккаунта и бронирований хранятся, пока аккаунт активен. Вы можете в любой момент попросить удалить аккаунт и все данные, написав на ${EMAIL}; мы удалим их в течение 30 дней.`],
      ['Ваши права', `Вы можете запросить копию данных, исправить или удалить их. Напишите на ${EMAIL} с email вашего аккаунта.`],
      ['Безопасность', 'Пароли обрабатывает наш провайдер входа; они никогда не хранятся в браузере или в наших таблицах. Сессии используют защищённый HttpOnly cookie.'],
    ],
  },
  terms: {
    title: 'Условия использования',
    sections: [
      ['Сервис', 'TravelMate помогает найти и забронировать туристические услуги в Узбекистане: отели, гидов, трансферы, билеты, туры, eSIM и другое. Саму услугу оказывает отель, гид, водитель, перевозчик или оператор, указанный в предложении.'],
      ['Цены', 'Цены указаны в долларах США с ориентировочным эквивалентом в сумах. Сумма в сумах зависит от дневного курса и может немного меняться. Цена при бронировании — это цена, которую вы платите; скрытых сборов нет.'],
      ['Бронирование и отмена', 'Бронь подтверждена, когда она появилась в Профиль → Мои бронирования. Трансфер можно бесплатно отменить за 24 часа до подачи. Отели, туры и билеты — по правилам на их странице. Для турпакетов — предоплата 30%, остаток за 14 дней до начала.'],
      ['Ваш аккаунт', 'Не передавайте данные для входа и указывайте верные контакты, чтобы поставщики могли с вами связаться. Мы можем заблокировать аккаунты, используемые для мошенничества или злоупотреблений.'],
      ['Ответственность', 'Мы проверяем партнёров перед размещением, но за услугу отвечает её поставщик. Если что-то пошло не так, свяжитесь с нами — поможем решить вопрос с поставщиком.'],
      ['Право', `Условия регулируются законодательством Республики Узбекистан. Вопросы: ${EMAIL}.`],
    ],
  },
  cookies: {
    title: 'Использование cookie',
    sections: [
      ['Необходимый cookie', 'tm_session — сохраняет вход (HttpOnly, защищённый, 30 дней). Без него нельзя бронировать.'],
      ['Провайдер входа', 'При входе наш провайдер (Neon Auth) может установить свой сессионный cookie на своём домене, чтобы завершить вход.'],
      ['Хранилище браузера', 'Язык, тема, последние поиски и история чата текущей вкладки хранятся только в браузере и нам не отправляются.'],
      ['Без рекламных cookie', 'TravelMate не использует рекламные и межсайтовые отслеживающие cookie.'],
    ],
  },
}

const byLang = { en, uz, ru }

export function legalDoc(doc, lng) {
  const set = byLang[lng] || en
  const d = set[doc] || en[doc]
  return d ? { ...d, updated: UPDATED } : null
}
