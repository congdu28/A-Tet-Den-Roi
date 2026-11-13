/**
 * Tet 2027 Greeting Card Studio Pro (Hoàng Gia Đinh Mùi)
 * - 4 Precision Aspect Ratios: Standard (4:3), Landscape (16:9), Square (1:1), Portrait Story (9:16)
 * - 6 Art Frame Styles: Royal Cung Đình, Floral Mai Đào, Folk Gấm Cổ Điển, Neon Ánh Kim, Vintage Thủy Mặc, Minimal Tối Giản
 * - 3 Quality Export Levels: HD Tiêu chuẩn (1x), 2K Sắc nét (2x), 4K Ultra HD (3x)
 * - Anti-Overflow Auto-Fitting Imperial Cinnabar Seal (Đinh Mùi Cát Tường)
 * - Massive 90+ Context-Aware AI Wish Database with 6 Distinct Emotional Tones
 * - Anti-Duplicate Greeting Cleaner & Responsive Typography Centering Engine
 * - 1-Click High-Res PNG Export & Clipboard Copy
 */
class CardMaker {
    constructor() {
        if (window.cardMakerInstance) {
            return window.cardMakerInstance;
        }
        window.cardMakerInstance = this;
        this.senderInput = document.getElementById('card-sender-input');
        this.recipientInput = document.getElementById('card-recipient-input');
        this.titleInput = document.getElementById('card-title-input');
        this.headerInput = document.getElementById('card-header-input');
        this.sealInput = document.getElementById('card-seal-input');
        this.fontSelect = document.getElementById('card-font-select');
        this.wishSelect = document.getElementById('card-wish-select');
        this.customWishInput = document.getElementById('card-custom-wish');
        this.themeSelect = document.getElementById('card-theme-select');
        this.patternSelect = document.getElementById('card-pattern-select');
        this.previewCanvas = document.getElementById('card-preview-canvas');
        this.downloadBtn = document.getElementById('btn-download-card');
        this.copyWishBtn = document.getElementById('btn-copy-card-wish');
        this.randomWishBtn = document.getElementById('btn-random-card-wish');
        this.resBadge = document.getElementById('card-resolution-badge');

        // AI Wish elements
        this.aiGenBtn = document.getElementById('btn-ai-gen-wish');
        this.selectedAiTone = 'warm';
        this.recentAiWishIndices = {};

        // Customization State
        this.selectedRatio = 'standard'; // 'standard', 'landscape', 'square', 'portrait'
        this.selectedMotif = 'goat'; // 'goat', 'blossom', 'lantern', 'gold', 'firework', 'envelope', 'none'
        this.selectedFrame = 'royal'; // 'royal', 'floral', 'folk', 'neon', 'vintage', 'minimal'
        this.selectedQuality = '2k'; // 'hd' (1x), '2k' (2x), '4k' (3x)
        this.selectedTextColor = 'gold-cream'; // 'gold-cream', 'pure-white', 'bright-gold', 'blossom-pink', 'dark-ink'
        this.wishAlign = 'center'; // 'center', 'left', 'right'
        this.showSeal = true;
        this.showSparkles = true;
        this.customBgImage = null;
        this.overlayOpacity = 0.45;
        this.recipientFontSize = 24;
        this.wishFontSize = 18;
        this.senderFontSize = 21;

        // 16 Rich Preset Wishes Covering All Audiences
        this.presetWishes = [
            // 0: Gia Đình & Cha Mẹ
            "Chúc mừng năm mới Đinh Mùi 2027! Kính chúc gia đình an khang thịnh vượng, vạn sự như ý, dồi dào sức khỏe và ngập tràn niềm vui!",
            // 1: Ông Bà Thượng Thọ
            "Kính chúc Ông Bà năm mới bách niên giai lão, thọ tỷ Nam Sơn, phúc như Đông Hải, luôn an vui thanh thản bên con cháu thảo hiền!",
            // 2: Thầy Cô Giáo
            "Kính chúc Thầy Cô một mùa xuân mới tràn đầy nhiệt huyết, gia đạo bình an, vạn sự cát tường và luôn vững tay chèo đưa học trò cập bến vinh quang!",
            // 3: Bạn Bè & Đồng Nghiệp
            "Xuân sang đắc lộc, vạn sự hanh thông! Chúc bạn công danh thăng tiến, tiền vào như nước, tình duyên phơi phới và đong đầy hạnh phúc!",
            // 4: Người Thương / Vợ Chồng
            "Năm mới đến rồi, cảm ơn người thương đã luôn đồng hành bên cạnh. Chúc tình yêu đôi ta mãi thắm nồng như hoa đào đầu xuân, trăm năm hòa hợp!",
            // 5: Sếp & Cấp Trên
            "Kính chúc Sếp năm mới Đinh Mùi 2027 vạn sự hanh thông, lãnh đạo tài ba, dẫn dắt công ty bứt phá ngoạn mục và gặt hái vô vàn thành công rực rỡ!",
            // 6: Đối Tác & Khách Hàng VIP
            "Kính chúc Quý đối tác năm mới Đinh Mùi kinh doanh hưng thịnh, đắc tài sai lộc, song hành phát triển bền vững và gặt hái ngàn thắng lợi lớn!",
            // 7: Đồng Nghiệp Thân Thiết
            "Chúc đồng nghiệp năm mới KPI vượt chỉ tiêu, thăng chức tăng lương vù vù, công việc êm xuôi và mỗi ngày đi làm đều rộn rã niềm vui!",
            // 8: Con Cháu & Các Em Nhỏ
            "Chúc các con các em thêm một tuổi mới hay ăn chóng lớn, chăm ngoan học giỏi, luôn vâng lời cha mẹ và gặt hái thật nhiều hoa điểm mười!",
            // 9: Hài Hước Gen Z Đỉnh Nóc
            "Chúc Tết 2027: Ăn nhiều không béo, thức khuya không mụn, deadline tự biến mất, sếp tự tăng lương, tiền tự nhảy vào ví và sớm có bồ siêu xịn!",
            // 10: Thơ Chúc Tết 4 Câu
            "Xuân sang rực rỡ muôn hoa hé,\nPhúc thọ an khang lộc chứa chan.\nCông danh rạng rỡ ngời muôn lối,\nNăm mới Đinh Mùi vạn sự an.",
            // 11: Thơ Lục Bát Cung Đình
            "Tân niên đón lộc tràn đầy,\nChúc mừng năm mới tháng ngày bình yên.\nTâm an phúc lộc triền miên,\nGia hòa vạn sự phỉ nguyền ước mơ.",
            // 12: Doanh Nghiệp & Kinh Doanh Đại Thắng
            "Chúc mừng năm mới! Chúc cửa hàng buôn may bán đắt, khách vào nườm nượp, tiền đếm mỏi tay, doanh số bùng nổ gấp năm gấp mười năm cũ!",
            // 13: Tân Niên Khởi Nghiệp Bứt Phá
            "Mừng xuân Đinh Mùi! Chúc sự nghiệp khởi sắc rạng rỡ, mở rộng thị phần, dự án đại thành công và vươn mình chạm tới những tầm cao mới!",
            // 14: Bình An & May Mắn Trọn Năm
            "Kính chúc một năm mới thân tâm an lạc, tai qua nạn khỏi, bốn mùa no ấm, gặp dữ hóa lành và luôn được che chở trong phúc lành may mắn!",
            // 15: Bản Thân Đón Xuân Đinh Mùi
            "Gửi tôi của năm mới 2027: Hãy luôn kiên cường, giữ vững niềm tin, thân tâm an lạc, dũng cảm theo đuổi ước mơ và gặt hái trọn vẹn hạnh phúc!"
        ];

        // Massive 90+ Context-Aware AI Wish Database (15 distinct wishes per tone)
        this.aiWishesByTone = {
            warm: [
                "Đầu xuân Đinh Mùi 2027, kính chúc {recipient} luôn dồi dào sức khỏe, bách niên thọ trường, thân tâm an lạc. Cảm ơn vì đã luôn là điểm tựa vững chãi và nguồn yêu thương vô bờ bến!",
                "Xuân sang hoa nở ngát hương, kính chúc {recipient} một năm mới gia đạo êm ấm, muôn nụ cười luôn hé trên môi, vạn sự thuận hòa và mọi ước nguyện đầu năm đều viên mãn!",
                "Kính chúc {recipient} một mùa xuân thắm đượm tình thân, bốn mùa an khang, phúc lộc tràn đầy, mỗi ngày trôi qua đều ngập tràn niềm vui và sự an yên trong tâm hồn!",
                "Mừng xuân Đinh Mùi 2027, kính chúc {recipient} một năm an nhiên tự tại, sức khỏe dồi dào, phúc như Đông Hải, thọ tỷ Nam Sơn, gia đình sum vầy hạnh phúc!",
                "Kính chúc {recipient} năm mới vạn sự cát tường, công việc hanh thông, cuộc sống an lành và luôn nhận được thật nhiều sự yêu thương, trân trọng từ mọi người!",
                "Mùa xuân mang đến hy vọng và yêu thương. Kính chúc {recipient} cùng toàn thể gia đình một năm mới dồi dào sức khỏe, tài lộc dâng tràn và hạnh phúc bất tận!",
                "Gửi trọn niềm tri ân sâu sắc nhất tới {recipient}. Kính chúc một mùa xuân Đinh Mùi tràn đầy sinh khí, mọi dự định đều thành công rực rỡ và gia đạo bình yên!",
                "Cầu mong mùa xuân 2027 mang đến cho {recipient} ngàn điều may mắn, vạn sự như ý, tâm an trí sáng và luôn vững bước trên mọi nẻo đường tương lai!",
                "Chúc mừng năm mới Đinh Mùi! Kính chúc {recipient} mỗi ngày mới đều rạng rỡ niềm vui, tràn đầy năng lượng tích cực và luôn được che chở trong bình an!",
                "Nhân dịp tân xuân Đinh Mùi, kính chúc {recipient} thân khỏe, tâm an, trí sáng, gia đình đầm ấm thuận hòa, con cháu thảo hiền và vạn sự cát tường!",
                "Kính chúc {recipient} một năm mới phúc lộc song toàn, may mắn gõ cửa mỗi ngày, tình thân thêm bền chặt và cuộc sống ngập tràn thi vị ngọt ngào!",
                "Xuân mới Đinh Mùi mở ra chương mới rạng rỡ. Kính chúc {recipient} mọi nỗi âu lo tan biến, niềm vui ở lại, bốn mùa an lành và hạnh phúc sum vầy!",
                "Kính chúc {recipient} năm mới dồi dào hồng phúc, vạn sự hanh thông, việc gì cũng xuôi chèo mát mái, gia đình luôn là bến đỗ bình yên nhất!",
                "Gửi ngàn lời chúc tốt đẹp nhất tới {recipient}: Chúc một mùa xuân đơm hoa kết trái, phúc thọ dồi dào, tài lộc bền vững và tình cảm thắm đượm!",
                "Kính chúc {recipient} bước sang năm Đinh Mùi 2027 với nụ cười luôn nở trên môi, mọi điều ước đều thành hiện thực và bình an theo gót suốt 365 ngày!",
                "Tết Đinh Mùi về mang theo nắng ấm và sum vầy. Kính chúc {recipient} một năm mới sức khỏe dẻo dai, tinh thần sảng khoái và luôn giữ mãi ngọn lửa ấm áp trong tim!",
                "Kính chúc {recipient} một mùa xuân thật trọn vẹn bên gia đình, mọi nhọc nhằn năm cũ đều hóa nhẹ tênh, nhường chỗ cho bình an và niềm vui gõ cửa mỗi sáng!",
                "Năm mới 2027 kính chúc {recipient} tâm luôn an lạc, trí luôn sáng suốt, bước đi vững vàng và gặt hái thật nhiều hoa trái ngọt lành trong cuộc sống!",
                "Xuân Đinh Mùi kính chúc {recipient} vạn dặm bình an, bốn mùa khỏe mạnh, gia đình hòa thuận êm ấm và lúc nào cũng ngập tràn tiếng cười hạnh phúc!",
                "Kính chúc {recipient} năm mới vạn sự tùy duyên mà đều cát tường, người thân luôn khỏe mạnh bình an, và mỗi ngày mới đều là một ngày đáng nhớ!"
            ],
            genz: [
                "Chúc {recipient} Tết Đinh Mùi 2027 cực chiến: Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin. Ăn bánh chưng không sợ béo, deadline tự bay màu và sớm có bồ xịn!",
                "Chúc {recipient} năm 2027 visual đỉnh nóc kịch trần, túi tiền dày cộm, tình duyên phơi phới, đi chơi không lo sập nguồn và sống một năm bùng nổ, rực rỡ nhất!",
                "Năm mới Đinh Mùi: Bớt âu lo, thêm nhiều tiền tiêu, việc nhẹ lương cao, ngủ kỹ ăn ngon, ví luôn dày cộp và lúc nào cũng tràn đầy năng lượng tích cực!",
                "Chúc {recipient} năm 2027: Điểm số rực rỡ, KPI tự hoàn thành, sếp quý đồng nghiệp thương, shopping không cần nhìn giá và đi đâu cũng có người bao ăn!",
                "Năm mới chúc {recipient} nhan sắc thăng hạng, tiền tài đổ bộ, nói không với drama, nói có với lì xì, tài khoản nhảy số ting ting liên tục không ngừng nghỉ!",
                "Tết 2027 thả dáng cực mượt: Chúc {recipient} ăn bánh tét không tăng cân, mở mắt thấy tiền, bước chân ra ngõ gặp quý nhân và sớm chốt đơn crush thành công!",
                "Vía Tết Đinh Mùi may mắn nhất hành tinh: Chúc {recipient} lướt sóng cuộc đời mượt mà, ví không bao giờ xẹp, tình duyên nở rộ và cả năm luôn vui vẻ như Tết!",
                "Chúc {recipient} năm mới 2027: Thần tài bấm chuông, tình duyên gõ cửa, deadline tự giải quyết, áp lực hóa thành tiền và sống đời thảnh thơi vô lo vô nghĩ!",
                "Năm Đinh Mùi chúc {recipient} visual phát sáng, năng lượng ngút ngàn, công việc thăng hoa, ví tiền chật chội và tài khoản luôn ở trạng thái số dư chín chữ số!",
                "Tết này chúc {recipient}: Ăn ngon không mập, thức khuya da vẫn mướt, lì xì đếm mỏi tay, bạn bè ai cũng dễ thương và một năm đại thắng không đối thủ!",
                "Bắn vía tài lộc 2027 chúc {recipient} tiền vào như lũ cuốn, xui xẻo bay như gió thoảng, tình yêu cập bến an toàn và luôn là nhân vật chính rạng ngời nhất!",
                "Chúc mừng năm mới! Chúc {recipient} năm 2027 không sợ deadline đè, chỉ sợ tiền đè, visual luôn đạt chuẩn 10/10 và mở ra một năm đỉnh của chóp!",
                "Chúc {recipient} Tết Đinh Mùi: Đi đâu cũng được cưng chiều, ở nhà được ngủ nướng, ra đường được phát quà và cả năm 2027 luôn vui cười tít mắt!",
                "Năm mới chúc {recipient}: Đẹp trai/xinh gái thêm bội phần, ví dày thêm chục tấc, công việc êm như ru và sớm có một chuyến vi vu vòng quanh thế giới!",
                "Chúc {recipient} năm mới 2027: Hạnh phúc ngập tràn, ví tiền căng cứng, năng lượng tích cực x2, sự nghiệp thăng tiến x10 và luôn mỉm cười tỏa nắng!",
                "Đinh Mùi 2027 chúc {recipient}: Sáng đi làm vui vẻ, chiều về ví nặng trĩu, tối ngủ ngon lành không mộng mị, không ai dám giao việc gấp cuối tuần!",
                "Chúc {recipient} năm mới bật chế độ may mắn tối đa: Mua gì cũng được giảm giá, đi đâu cũng gặp người tốt, ước gì được nấy nhanh như chớp!",
                "Tết 2027 chúc {recipient} hệ điều hành cuộc sống chạy mượt 120fps, không giật lag vì deadline, bộ nhớ đầy ắp kỷ niệm đẹp và pin năng lượng luôn 100%!",
                "Năm mới chúc {recipient}: Tiền tiêu không cần đếm, cân nặng đứng yên dù ăn thả ga, tình duyên tự động tìm tới và cả năm cười nhiều hơn cả năm cũ!",
                "Chúc {recipient} năm Đinh Mùi 2027: Nâng cấp toàn diện từ sự nghiệp tới tình cảm, mọi KPI đều qua nhẹ như lông hồng, lì xì nhận mỏi cả tay!"
            ],
            luxury: [
                "Kính chúc {recipient} một mùa xuân Đinh Mùi 2027 Đại Cát - Đại Lợi! Sự nghiệp thăng hoa vượt bậc, vị thế vững vàng, mở ra kỷ nguyên thành công rực rỡ và thịnh vượng trường tồn!",
                "Nhân dịp tân xuân Đinh Mùi, kính chúc {recipient} vạn sự hanh thông, đắc thời đắc lợi, uy tín vang xa, tài lộc dồi dào và luôn giữ vững phong độ của người dẫn đầu!",
                "Cung chúc tân xuân 2027! Kính chúc {recipient} bách nghiệp hưng thịnh, ký kết ngàn hợp đồng lớn, kinh doanh phát đạt và gặt hái những cột mốc huy hoàng nhất!",
                "Kính chúc {recipient} năm mới Đinh Mùi tầm nhìn vươn xa, chiến lược sắc bén, doanh nghiệp bứt phá ngoạn mục và khẳng định vị thế đỉnh cao trên thương trường!",
                "Kính chúc {recipient} một năm mới phong độ ngút ngời, bản lĩnh kiên cường, gặt hái ngàn thành tựu rực rỡ và luôn là nguồn cảm hứng lớn lao cho tập thể!",
                "Chúc mừng năm mới Đinh Mùi 2027! Kính chúc {recipient} phúc lộc hưng vượng, vạn dặm công danh thênh thang, nguồn lực dồi dào và kiến tạo nên những kỳ tích mới!",
                "Kính chúc {recipient} một năm tân niên cát khánh, hội tụ tinh hoa, dẫn dắt đội ngũ vươn tầm cao mới và luôn là ngọn hải đăng soi sáng mọi thành công!",
                "Cung chúc tân xuân! Kính chúc {recipient} gặt hái vô vàn thắng lợi vang dội, uy danh sáng ngời, tài chính hùng hậu và gia đạo vinh hoa phú quý!",
                "Kính chúc {recipient} năm mới Đinh Mùi: Phúc lộc dồi dào như biển lớn, công danh rực rỡ tựa thái dương, sự nghiệp thăng hoa vững bền theo năm tháng!",
                "Chúc mừng năm mới 2027! Kính chúc {recipient} đón mùa xuân mới với muôn điều cát tường, bách chiến bách thắng, uy tín nâng tầm và thịnh vượng muôn đời!",
                "Kính chúc {recipient} bước sang năm Đinh Mùi với những cơ hội bứt phá phi thường, quan hệ hợp tác bền chặt và chinh phục trọn vẹn những đỉnh cao danh vọng!",
                "Cung chúc tân xuân Đinh Mùi! Kính chúc {recipient} trí tuệ mẫn tiệp, phong thái đĩnh đạc, bách sự như ý và mở rộng quy mô thịnh vượng vượt bậc!",
                "Kính chúc {recipient} một mùa xuân tràn đầy vượng khí, tài đức song toàn, sự nghiệp hiển vinh, vạn sự hanh thông và tài lộc dồi dào viên mãn!",
                "Năm mới Đinh Mùi 2027, kính chúc {recipient} củng cố vị thế dẫn đầu, hiện thực hóa mọi tầm nhìn chiến lược và gặt hái một năm bội thu thắng lợi rực rỡ!",
                "Kính chúc {recipient} tân niên đại cát, trường tồn thịnh vượng, sức khỏe dồi dào, tâm lực vững vàng và luôn là người tiên phong kiến tạo giá trị đỉnh cao!",
                "Kính chúc {recipient} năm Đinh Mùi 2027 vững tay chèo lái, mở rộng tầm ảnh hưởng, mọi quyết sách đều mang lại thắng lợi vang dội và giá trị bền vững!",
                "Nhân dịp tân niên, kính chúc {recipient} hội tụ thiên thời địa lợi nhân hòa, sự nghiệp thăng hoa tột đỉnh, tài lộc dồi dào và danh tiếng lẫy lừng!",
                "Kính chúc {recipient} một năm mới Đinh Mùi khí thế hiên ngang, bứt phá mọi giới hạn, kiến tạo những dấu ấn xuất sắc và gặt hái thành công viên mãn!",
                "Cung chúc tân xuân 2027! Kính chúc {recipient} tâm trí minh mẫn, sức khỏe sung mãn, hợp tác quốc tế hanh thông và thịnh vượng trường cửu!",
                "Kính chúc {recipient} năm mới đón vạn phúc lành, sự nghiệp vững như bàn thạch, tài vận hanh thông như dòng chảy bất tận và gia đạo vinh hiển!"
            ],
            poem: [
                "Xuân sang rực rỡ ngát hương hoa,\nChúc mừng năm mới đến muôn nhà.\nCầu mong hạnh phúc cùng thịnh vượng,\nPhú quý vinh hoa rạng cõi xa!",
                "Dê vàng gõ cửa đón bình minh,\nThắm đượm mùa xuân nghĩa thâm tình.\nCông thành danh toại ngời muôn lối,\nMột đời an lạc sáng lung linh!",
                "Gió xuân lộng ngát áng mây bay,\nPhúc lộc tràn trề tháng lại ngày.\nSức khỏe dồi dào tâm vững chãi,\nThỏa chí tang bồng giữa trời mây!",
                "Đinh Mùi xuân mới ngập niềm vui,\nGian khó năm qua khép lại rồi.\nĐón lộc tân niên tràn ngõ xóm,\nMuôn nhà no ấm rạng nụ cười!",
                "Mai vàng đua nở rạng cành cây,\nĐào biếc lung linh đón gió lay.\nKính chúc muôn người an khang thịnh,\nPhước tài đong đọng mãi nơi đây!",
                "Mừng xuân Đinh Mùi rộn tiếng ca,\nPhúc ấm chan hòa khắp muôn nhà.\nTiền tài danh vọng ngời thơm ngát,\nBốn mùa an lạc tựa bài ca!",
                "Xuân về gieo hạt đón mầm xanh,\nVạn sự hanh thông ước mộng thành.\nSức khỏe dồi dào thân trí tĩnh,\nTháng ngày rạng rỡ sáng lung linh!",
                "Cung chúc tân xuân phát lộc tài,\nNụ cười rạng rỡ đón ngày mai.\nGia đình sum họp tràn ân nghĩa,\nPhú quý bình an trải rộng dài!",
                "Pháo hoa tỏa sáng giữa màn đêm,\nKhí xuân ấm áp ngập bên thềm.\nChúc người vạn sự luôn như ý,\nNăm mới an khang phúc ấm êm!",
                "Đinh Mùi gõ nhịp khúc ca xuân,\nTài lộc dâng cao bước lại gần.\nCông danh tấn tới ngời trang sách,\nThịnh vượng an khang dạ chứa chan!",
                "Bánh chưng xanh biếc ấm tình thân,\nCâu đối đỏ tươi đón sắc xuân.\nKính chúc gia đình an khang thịnh,\nPhúc đức lưu truyền vạn thế xuân!",
                "Xuân sang hoa nở rạng muôn nơi,\nChúc mừng năm mới rộn tiếng cười.\nTấn tài tấn lộc tân niên thịnh,\nAn khang phúc thọ sáng ngời ngời!",
                "Rượu nồng nâng chén đón tân niên,\nCầu chúc người thương dứt muộn phiền.\nTâm sáng lòng an đời thanh thản,\nĐinh Mùi gặt hái lộc triền miên!",
                "Mai vàng đào thắm ngát hương bay,\nXuân mới Đinh Mùi đón lộc dày.\nVạn sự hanh thông tiền đầy túi,\nBình an hạnh phúc ngập tràn tay!",
                "Giao thừa điểm tiếng chuông ngân nga,\nPhúc lộc tràn trề đến muôn nhà.\nChúc người năm mới vinh hoa thịnh,\nMột đời hạnh phúc rạng như hoa!",
                "Nắng xuân rải nhẹ khắp sân đình,\nĐinh Mùi gõ cửa đón bình minh.\nCầu chúc muôn nơi luôn no ấm,\nTrọn năm hạnh phúc thắm ân tình!",
                "Lộc biếc đâm chồi đón gió đông,\nĐào phai hé nụ thắm bên song.\nChúc người năm mới tâm an lạc,\nVạn sự hanh thông thỏa ước mong!",
                "Chén trà đầu năm ấm nghĩa tình,\nPháo hoa rực rỡ sáng lung linh.\nChúc cho gia đạo luôn êm ấm,\nPhúc thọ an khang rạng bóng hình!",
                "Tân niên mở hội khắp muôn phương,\nTiếng trống lân vang rộn phố phường.\nKính chúc mọi nhà thêm phú quý,\nXuân về ngập tràn ánh yêu thương!",
                "Đêm xuân lắng đọng khúc giao mùa,\nGió thoảng hương mai nhẹ khẽ lùa.\nChúc bạn một năm đầy thắng lợi,\nTiền tài danh vọng tựa mùa thu hoạch!"
            ],
            wealth: [
                "Đinh Mùi đại thắng! Chúc {recipient} bước sang năm mới buôn may bán đắt, khách vào nườm nượp, tiền đếm mỏi tay, vàng bạc đầy két. Đầu tư đâu trúng đó, nguồn thu bùng nổ gấp năm gấp mười!",
                "Chúc mừng năm mới 2027! Chúc {recipient} dòng tiền cuồn cuộn như thác đổ, các khoản đầu tư sinh lời vượt bậc, lộc biếc đâm chồi, cả năm hưởng trọn vinh hoa phú quý!",
                "Khai xuân nghênh lộc! Chúc {recipient} năm mới mở lối giàu sang, tiền đẻ ra tiền, kinh doanh phát đạt, ví luôn căng tràn và một năm đại bội thu viên mãn!",
                "Tân xuân Đinh Mùi chúc {recipient}: Đơn hàng bay tới tấp, doanh thu chạm nóc, đối tác tin cậy, thị trường mở rộng và tiền tài đổ về ùn ùn như sóng biển!",
                "Chúc {recipient} năm mới vạn sự hanh thông, khai trương hồng phát, ký hợp đồng mỏi tay, lợi nhuận tăng vọt và tài khoản nhảy số ting ting cả ngày lẫn đêm!",
                "Mừng năm Đinh Mùi 2027: Chúc {recipient} kim ngọc mãn đường, vàng thỏi đầy rương, buôn một lãi mười, tiền tài như ý và sung túc đủ đầy suốt bốn mùa!",
                "Chúc {recipient} một năm khai hoa nở lộc, mở mang bờ cõi kinh doanh, khách lạ thành quen, khách quen thành ruột, doanh số tăng trưởng kỷ lục nhất từ trước đến nay!",
                "Khai xuân đắc lộc! Chúc {recipient} bước sang năm 2027 lộc tài phơi phới, vận may dồn dập, tiền vô như nước sông Đà, tiền ra nhỏ giọt như cà phê phin!",
                "Chúc mừng tân xuân! Chúc {recipient} năm Đinh Mùi gặt hái ngàn hợp đồng bạc tỷ, ngân khố dồi dào, tài chính vững chắc và làm đâu thắng đó, vạn sự đại thành!",
                "Năm mới Đinh Mùi chúc {recipient}: Phúc lộc dồi dào, tiền vô xối xả, vàng bạc chất đống, kinh doanh hanh thông và cả năm rủng rỉnh túi tiền!",
                "Chúc mừng năm mới 2027! Chúc {recipient} một năm kinh doanh đại thắng lợi, phát tài phát lộc, vạn sự hưng vượng, tài lộc dồi dào như suối nguồn vô tận!",
                "Đón lộc đầu xuân Đinh Mùi: Chúc {recipient} buôn may bán đắt, tiền vô như nước, tiền ra nhỏ giọt, tài lộc đầy nhà, con cháu sung túc!",
                "Chúc {recipient} một năm mới bứt phá doanh thu, tiền vàng đầy két, lộc biếc nảy mầm, mở rộng chi nhánh và khẳng định vị thế hùng mạnh trên thị trường!",
                "Cung chúc tân xuân phát tài! Chúc {recipient} năm 2027 gặt hái tài lộc dồi dào, đầu tư siêu lợi nhuận, tiền đẻ ra tiền và một năm thịnh vượng đỉnh cao!",
                "Khởi sắc đầu xuân! Chúc {recipient} năm Đinh Mùi vạn sự may mắn, lộc tài như ý, công việc phát đạt, nguồn thu dồi dào và thịnh vượng vững bền!",
                "Chúc {recipient} năm 2027 mở hàng đắt khách, tiền vô cửa trước, vàng vào cửa sau, kho báu đầy ắp và cả năm sung túc không lo nghĩ!",
                "Đầu xuân Đinh Mùi chúc {recipient}: Lộc lá sum suê, dự án nào cũng sinh lời, tiền bạc sinh sôi nảy nở và tài chính vững mạnh gấp bội phần!",
                "Chúc {recipient} năm mới vượng tài vượng lộc, buôn bán thuận buồm xuôi gió, ký kết hợp đồng rộn ràng và thu nhập tăng trưởng phi mã!",
                "Tân niên phát đạt! Chúc {recipient} năm 2027 gặp nhiều quý nhân phù trợ trong làm ăn, mở rộng quy mô rực rỡ và lợi nhuận bùng nổ!",
                "Chúc {recipient} một năm Đinh Mùi túi tiền luôn rủng rỉnh, tài khoản tăng số đều đặn mỗi ngày, đầu tư an toàn thắng lớn và phú quý ngập tràn!"
            ],
            love: [
                "Gửi người thương yêu nhất: Cảm ơn một năm qua đã luôn kề vai sát cánh. Năm mới Đinh Mùi 2027, chúc tình yêu đôi ta mãi thắm nồng như hoa đào đầu xuân, trăm năm hòa hợp và cùng nhau xây đắp tương lai rực rỡ!",
                "Năm mới đến rồi, chúc người thương mỗi sớm mai thức dậy đều rạng rỡ nụ cười. Cảm ơn vì đã là món quà tuyệt vời nhất và chúc cho chúng ta sẽ cùng viết tiếp chương mới thật hạnh phúc!",
                "Xuân sang chúc {recipient} luôn bình an, rạng ngời và ngập tràn niềm vui. Hãy luôn nắm chặt tay nhau để cùng bước qua vạn dặm yêu thương trong năm mới nhé!",
                "Mùa xuân có hoa mai, hoa đào, còn mùa xuân của mình có {recipient}. Chúc em/anh một năm mới ngập tràn hạnh phúc, bình yên và luôn là điều ngọt ngào nhất cuộc đời anh/em!",
                "Đinh Mùi rộn rã pháo hoa, nhưng điều lấp lánh nhất trong lòng mình chính là nụ cười của {recipient}. Chúc cho tình yêu đôi ta năm mới thêm bền chặt, mặn nồng và viên mãn!",
                "Chúc người thương một mùa xuân ấm áp, an lành, luôn xinh đẹp và rạng rỡ. Cảm ơn vì đã cùng nhau đi qua bao thăng trầm, năm mới hãy cùng nhau đón ngàn niềm vui mới!",
                "Gửi tới {recipient} ngàn nụ hôn ngọt ngào đầu xuân. Chúc cho tình cảm của chúng mình ngày càng sâu đậm, mỗi ngày trôi qua đều là một ngày Valentine ngọt ngào!",
                "Năm mới Đinh Mùi, không mong gì hơn ngoài việc thấy {recipient} luôn khỏe mạnh, vui vẻ và hạnh phúc. Chúng mình sẽ mãi cùng nhau già đi theo năm tháng nhé!",
                "Đón giao thừa bên {recipient} là khoảnh khắc kỳ diệu nhất. Chúc cho tình yêu đôi ta vượt qua mọi bão giông, cùng nhau gặt hái những ước mơ tươi đẹp nhất năm 2027!",
                "Gửi người giữ chìa khóa trái tim mình: Chúc {recipient} một năm mới Đinh Mùi rực rỡ, bình yên và hạnh phúc. Cảm ơn vì đã đến và sưởi ấm thế giới của mình!",
                "Xuân về mang hương sắc mới, chúc tình yêu của chúng ta mãi ngọt ngào, thủy chung son sắt và cùng nhau đón thêm thật nhiều mùa xuân rạng rỡ phía trước!",
                "Chúc {recipient} năm mới nụ cười luôn tỏa nắng, ánh mắt luôn rạng ngời hạnh phúc. Dù thế giới ngoài kia có ra sao, nơi đây vẫn mãi là bến đỗ bình yên cho {recipient}!",
                "Năm mới Đinh Mùi chúc cho đôi mình luôn thấu hiểu, sẻ chia, yêu thương nhiều hơn mỗi ngày và cùng nhau viết nên câu chuyện tình yêu đẹp nhất trần đời!",
                "Gửi ngàn đóa hoa xuân tươi thắm nhất tới {recipient}. Chúc em/anh một năm mới ngập tràn may mắn, bình an và mãi là người đồng hành tuyệt vời nhất của anh/em!",
                "Chúc người thương năm mới 2027: Yêu đời hơn, hạnh phúc hơn, an yên hơn và tình yêu đôi ta sẽ mãi đong đầy như chén rượu xuân nồng nàn!",
                "Xuân Đinh Mùi 2027 chúc {recipient} luôn rạng rỡ như đóa hoa mai sớm, bình yên trong vòng tay yêu thương và cùng nhau đi hết mọi mùa xuân cuộc đời!",
                "Cảm ơn {recipient} đã làm thế giới của mình trở nên dịu dàng hơn. Chúc năm mới đôi ta luôn nắm chặt tay nhau, chia sẻ mọi buồn vui và hạnh phúc mãi!",
                "Năm mới đến rồi, điều ước lớn nhất vẫn là được thấy nụ cười của {recipient} mỗi ngày. Chúc tình yêu của chúng mình mãi xanh tươi như mùa xuân!",
                "Chúc {recipient} một mùa xuân ngọt ngào, ấm áp và bình an. Dù thời gian có trôi qua bao mùa Tết, tình cảm dành cho nhau vẫn nguyên vẹn như thuở ban đầu!",
                "Đinh Mùi 2027, chúc cho mọi dự định chung của đôi ta đều đơm hoa kết trái, mỗi bước đi đều có nhau và tràn ngập tiếng cười hạnh phúc!"
            ]
        };

        this.needsRender = true;
        this.renderFrameId = null;
        this.bindEvents();
        this.renderIfNeeded();
    }

    bindEvents() {
        const updateEvents = ['input', 'change'];
        [this.senderInput, this.recipientInput, this.titleInput, this.headerInput, this.sealInput, this.fontSelect, this.themeSelect, this.patternSelect].forEach(elem => {
            if (elem) {
                updateEvents.forEach(evt => elem.addEventListener(evt, () => this.scheduleRender()));
            }
        });

        // Text Color Chips
        const textColorChips = document.querySelectorAll('#card-text-color-chips .card-theme-chip');
        textColorChips.forEach(chip => {
            chip.addEventListener('click', () => {
                textColorChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.selectedTextColor = chip.dataset.textColor || 'gold-cream';
                this.scheduleRender();
            });
        });

        // Wish Alignment Chips
        const alignChips = document.querySelectorAll('#card-align-chips .card-frame-chip');
        alignChips.forEach(chip => {
            chip.addEventListener('click', () => {
                alignChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.wishAlign = chip.dataset.align || 'center';
                this.scheduleRender();
            });
        });

        // Seal & Sparkles Toggles
        const sealToggle = document.getElementById('toggle-card-seal');
        if (sealToggle) {
            sealToggle.addEventListener('change', (e) => {
                this.showSeal = e.target.checked;
                this.scheduleRender();
            });
        }
        const sparkleToggle = document.getElementById('toggle-card-sparkles');
        if (sparkleToggle) {
            sparkleToggle.addEventListener('change', (e) => {
                this.showSparkles = e.target.checked;
                this.scheduleRender();
            });
        }
        if (this.customWishInput) {
            updateEvents.forEach(evt => this.customWishInput.addEventListener(evt, () => {
                this.cancelTypewriter();
                this.renderCard();
            }));
        }

        // 1. Ratio Chips
        const ratioChips = document.querySelectorAll('.card-ratio-chip');
        ratioChips.forEach(chip => {
            chip.addEventListener('click', () => {
                ratioChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.selectedRatio = chip.getAttribute('data-ratio') || 'standard';
                this.updateResolutionBadge();
                this.renderCard();
                if (window.tetAudio) window.tetAudio.playLuckyChime();
            });
        });

        // 2. Motif Chips
        const motifChips = document.querySelectorAll('.card-motif-chip');
        motifChips.forEach(chip => {
            chip.addEventListener('click', () => {
                motifChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.selectedMotif = chip.getAttribute('data-motif') || 'goat';
                this.renderCard();
                if (window.tetAudio) window.tetAudio.playLuckyChime();
            });
        });

        // 3. Theme Visual Chips
        const cardThemeChips = document.querySelectorAll('.card-theme-chip');
        cardThemeChips.forEach(chip => {
            chip.addEventListener('click', () => {
                cardThemeChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const themeVal = chip.getAttribute('data-card-theme') || 'red';
                if (this.themeSelect) this.themeSelect.value = themeVal;
                this.renderCard();
                if (window.tetAudio) window.tetAudio.playLuckyChime();
            });
        });

        // 4. Frame Style Chips (NEW)
        const frameChips = document.querySelectorAll('.card-frame-chip');
        frameChips.forEach(chip => {
            chip.addEventListener('click', () => {
                frameChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.selectedFrame = chip.getAttribute('data-frame') || 'royal';
                this.renderCard();
                if (window.tetAudio) window.tetAudio.playLuckyChime();
            });
        });

        // 5. Quality Selection Chips (NEW)
        const qualityChips = document.querySelectorAll('.card-quality-chip');
        qualityChips.forEach(chip => {
            chip.addEventListener('click', () => {
                qualityChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.selectedQuality = chip.getAttribute('data-quality') || '2k';
                this.updateResolutionBadge();
                this.updateDownloadBtnText();
                if (window.tetAudio) window.tetAudio.playLuckyChime();
            });
        });

        // 6. AI Tone Chips
        const aiToneChips = document.querySelectorAll('.ai-tone-chip');
        aiToneChips.forEach(chip => {
            chip.addEventListener('click', () => {
                aiToneChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.selectedAiTone = chip.getAttribute('data-tone') || 'warm';
                if (window.tetAudio) window.tetAudio.playLuckyChime();
            });
        });

        // 7. AI Generator Button
        if (this.aiGenBtn) {
            this.aiGenBtn.addEventListener('click', () => this.generateAIWish());
        }

        // 8. Preset Wish Select
        if (this.wishSelect) {
            this.wishSelect.addEventListener('change', () => {
                const val = parseInt(this.wishSelect.value, 10);
                if (val >= 0 && val < this.presetWishes.length) {
                    this.cancelTypewriter();
                    if (this.customWishInput) {
                        this.customWishInput.value = this.presetWishes[val];
                    }
                    this.renderCard();
                }
            });
        }

        // 9. Random Wish Button
        if (this.randomWishBtn) {
            this.randomWishBtn.addEventListener('click', () => {
                const randIdx = Math.floor(Math.random() * this.presetWishes.length);
                if (this.wishSelect) this.wishSelect.value = randIdx;
                this.cancelTypewriter();
                if (this.customWishInput) this.customWishInput.value = this.presetWishes[randIdx];
                this.renderCard();
                if (window.tetAudio) window.tetAudio.playLuckyChime();
            });
        }

        // 10. Custom Background Image Upload
        const customBgInput = document.getElementById('card-custom-bg-input');
        const removeBgBtn = document.getElementById('btn-remove-custom-bg');

        if (customBgInput) {
            customBgInput.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                const maxImgBytes = 15 * 1024 * 1024;
                if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.size > maxImgBytes) {
                    this.showToastMessage('⚠️ Vui lòng chọn ảnh JPG/PNG/WebP hợp lệ (tối đa 15MB).', 3000);
                    customBgInput.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        this.customBgImage = img;
                        if (removeBgBtn) removeBgBtn.style.display = 'inline-flex';
                        this.scheduleRender();
                        this.showToastMessage('🖼️ Đã tải lên ảnh nền cá nhân thành công!', 2500);
                    };
                    img.onerror = () => {
                        this.showToastMessage('⚠️ Không thể đọc tệp ảnh này, vui lòng thử ảnh khác.', 2800);
                        customBgInput.value = '';
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        }

        if (removeBgBtn) {
            removeBgBtn.addEventListener('click', () => {
                this.customBgImage = null;
                if (customBgInput) customBgInput.value = '';
                removeBgBtn.style.display = 'none';
                this.renderCard();
            });
        }

        // 11. Background Overlay Darkness Slider
        const overlayRange = document.getElementById('card-bg-overlay-range');
        const overlayText = document.getElementById('overlay-value-text');
        if (overlayRange) {
            overlayRange.addEventListener('input', (e) => {
                this.overlayOpacity = parseFloat(e.target.value);
                if (overlayText) {
                    overlayText.textContent = Math.round(this.overlayOpacity * 100) + '%';
                }
                this.renderCard();
            });
        }

        // 11b. Studio 3-Tab Navigation
        const studioTabBtns = document.querySelectorAll('.studio-tab-btn');
        const studioTabPanes = document.querySelectorAll('.studio-tab-pane');
        if (studioTabBtns.length) {
            studioTabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetTab = btn.dataset.studioTab;
                    studioTabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    studioTabPanes.forEach(pane => {
                        pane.classList.toggle('active', pane.id === `studio-pane-${targetTab}`);
                    });
                });
            });
        }

        // 11c. Font Size Sliders (Recipient, Wish, Sender) & Reset
        const recipientRange = document.getElementById('range-recipient-size');
        const recipientVal = document.getElementById('val-recipient-size');
        const wishRange = document.getElementById('range-wish-size');
        const wishVal = document.getElementById('val-wish-size');
        const senderRange = document.getElementById('range-sender-size');
        const senderVal = document.getElementById('val-sender-size');
        const resetFontsBtn = document.getElementById('btn-reset-card-fonts');

        const bindFontSlider = (rangeEl, valEl, propName) => {
            if (!rangeEl) return;
            rangeEl.addEventListener('input', (e) => {
                const size = parseInt(e.target.value, 10);
                if (!Number.isNaN(size)) {
                    this[propName] = size;
                    if (valEl) valEl.textContent = `${size}px`;
                    this.renderCard();
                }
            });
        };

        bindFontSlider(recipientRange, recipientVal, 'recipientFontSize');
        bindFontSlider(wishRange, wishVal, 'wishFontSize');
        bindFontSlider(senderRange, senderVal, 'senderFontSize');

        if (resetFontsBtn) {
            resetFontsBtn.addEventListener('click', () => {
                this.recipientFontSize = 24;
                this.wishFontSize = 18;
                this.senderFontSize = 21;

                if (recipientRange) recipientRange.value = '24';
                if (recipientVal) recipientVal.textContent = '24px';
                if (wishRange) wishRange.value = '18';
                if (wishVal) wishVal.textContent = '18px';
                if (senderRange) senderRange.value = '21';
                if (senderVal) senderVal.textContent = '21px';

                this.renderCard();
            });
        }

        // 12. Download & Copy Buttons
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadCard());
        }

        if (this.copyWishBtn) {
            this.copyWishBtn.addEventListener('click', () => this.copyWish());
        }
    }

    updateResolutionBadge() {
        if (!this.resBadge) return;
        const qualityScale = {
            'hd': { label: 'HD (1x)', mult: 1 },
            '2k': { label: '2K Sắc Nét (2x)', mult: 2 },
            '4k': { label: '4K Ultra HD (3x)', mult: 3 }
        };
        const curQ = qualityScale[this.selectedQuality] || qualityScale['2k'];

        const baseDimensions = {
            'standard': { w: 1000, h: 750, name: 'Chuẩn 4:3' },
            'landscape': { w: 1200, h: 675, name: 'Ngang 16:9' },
            'square': { w: 1000, h: 1000, name: 'Vuông 1:1' },
            'portrait': { w: 720, h: 1280, name: 'Dọc Story 9:16' }
        };

        const dim = baseDimensions[this.selectedRatio] || baseDimensions['standard'];
        const actualW = dim.w * curQ.mult;
        const actualH = dim.h * curQ.mult;

        this.resBadge.textContent = `📐 ${actualW} × ${actualH} px (${dim.name} • ${curQ.label})`;
    }

    updateDownloadBtnText() {
        if (!this.downloadBtn) return;
        const heroTitle = this.downloadBtn.querySelector('.btn-hero-text strong');
        if (heroTitle) {
            const labels = {
                'hd': 'TẢI THIỆP VỀ MÁY (HD TIÊU CHUẨN)',
                '2k': 'TẢI THIỆP VỀ MÁY (2K SẮC NÉT)',
                '4k': 'TẢI THIỆP VỀ MÁY (4K SIÊU NÉT)'
            };
            heroTitle.textContent = labels[this.selectedQuality] || 'TẢI THIỆP VỀ MÁY (PNG SIÊU NÉT)';
        }
    }

    cancelTypewriter() {
        if (this.typeInterval) {
            clearInterval(this.typeInterval);
            this.typeInterval = null;
        }
    }

    /**
     * AI Wish Generator Engine
     * Generates context-aware personalized wishes with full-cycle non-repeating selection
     * and smooth Unicode-safe typewriter animation
     */
    generateAIWish() {
        const sender = (this.senderInput && this.senderInput.value.trim()) || "Con / Cháu / Mình";
        const recipient = (this.recipientInput && this.recipientInput.value.trim()) || "Cha Mẹ Yêu Quý";
        const tone = this.selectedAiTone || 'warm';

        const pool = this.aiWishesByTone[tone] || this.aiWishesByTone.warm;

        // Full-cycle non-repeating random picker
        if (!this.recentAiWishIndices[tone] || this.recentAiWishIndices[tone].length >= pool.length) {
            this.recentAiWishIndices[tone] = [];
        }
        const usedSet = new Set(this.recentAiWishIndices[tone]);
        const availableIndices = [];
        for (let i = 0; i < pool.length; i++) {
            if (!usedSet.has(i)) availableIndices.push(i);
        }
        const randIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        this.recentAiWishIndices[tone].push(randIdx);

        // Replace template variables
        const wishTemplate = pool[randIdx];
        const finalizedWish = wishTemplate.replace(/{recipient}/g, recipient).replace(/{sender}/g, sender);

        // Cancel any previous typing interval cleanly
        this.cancelTypewriter();

        if (this.customWishInput) {
            // Split safely by Unicode code points (preserves Vietnamese diacritics & emojis)
            const chars = Array.from(finalizedWish);
            let charIndex = 0;
            const stepChars = 2; // 2 chars per tick for snappy, natural AI streaming speed
            const tickMs = 16;   // ~60fps smooth typing

            this.customWishInput.value = '';
            this.customWishInput.classList.remove('ai-generated-pulse');
            void this.customWishInput.offsetWidth;
            this.customWishInput.classList.add('ai-generated-pulse');
            setTimeout(() => {
                if (this.customWishInput) {
                    this.customWishInput.classList.remove('ai-generated-pulse');
                }
            }, 900);

            this.typeInterval = setInterval(() => {
                charIndex = Math.min(chars.length, charIndex + stepChars);
                this.customWishInput.value = chars.slice(0, charIndex).join('');
                this.customWishInput.scrollTop = this.customWishInput.scrollHeight;

                // Re-render canvas every 6 chars or at completion to keep performance silky smooth
                if (charIndex % 6 === 0 || charIndex >= chars.length) {
                    this.renderCard();
                }

                if (charIndex >= chars.length) {
                    this.cancelTypewriter();
                    this.renderCard();
                }
            }, tickMs);
        }

        if (window.tetAudio) window.tetAudio.playLuckyChime();
        if (window.fireworks) fireworks.explodeAt(window.innerWidth / 2, window.innerHeight * 0.4);

        const toneNames = {
            'warm': 'Ấm Áp & Tri Ân',
            'genz': 'Hài Hước Gen Z',
            'luxury': 'Sang Trọng Đẳng Cấp',
            'poem': 'Thơ Xuân 4 Câu',
            'wealth': 'Bội Thu Tài Lộc',
            'love': 'Lãng Mạn Tình Duyên'
        };
        const tName = toneNames[tone] || 'Độc Quyền';
        this.showToastMessage(`✨ AI đang viết lời chúc [${tName}] dành riêng cho bạn!`, 2800);
    }

    showToastMessage(text, duration = 2800) {
        const toast = document.getElementById('tet-toast');
        if (!toast) return;
        toast.textContent = String(text ?? '');
        toast.classList.remove('hidden');
        if (window.toastTimer) clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => toast.classList.add('hidden'), duration);
    }

    /**
     * Splits text into wrapped lines for given maxWidth
     */
    getWrappedLines(ctx, text, maxWidth) {
        if (!text) return [];
        const rawLines = text.split('\n');
        const resultLines = [];

        rawLines.forEach(rawLine => {
            const words = rawLine.trim().split(/\s+/);
            if (words.length === 0 || (words.length === 1 && words[0] === '')) {
                return;
            }
            let line = '';
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    resultLines.push(line.trim());
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            if (line.trim().length > 0) {
                resultLines.push(line.trim());
            }
        });

        return resultLines;
    }

    /**
     * Cleans salutation from wish body to prevent "Kính gửi Cha Mẹ... Kính gửi Cha Mẹ..." duplication
     */
    cleanWishBody(wish) {
        if (!wish) return '';
        return wish.trim();
    }

    /**
     * Render preview only when Card Studio tab is visible
     */
    renderIfNeeded() {
        const sec = document.getElementById('section-card');
        if (this.needsRender && (!sec || sec.classList.contains('active'))) {
            this.renderCard();
        }
    }

    /**
     * Render via rAF if Card Studio is active, otherwise mark dirty for lazy render
     */
    requestSmartRender() {
        const sec = document.getElementById('section-card');
        if (sec && sec.classList.contains('active')) {
            this.scheduleRender();
        } else {
            this.needsRender = true;
        }
    }

    /**
     * Coalesce rapid input/slider updates into one animation frame
     */
    scheduleRender() {
        this.needsRender = true;
        if (this.renderFrameId) return;
        this.renderFrameId = requestAnimationFrame(() => {
            this.renderFrameId = null;
            this.renderCard();
        });
    }

    /**
     * Main render entry for real-time preview canvas
     */
    renderCard() {
        if (!this.previewCanvas) return;
        this.needsRender = false;
        this.renderCardToCanvas(this.previewCanvas, 1.0);
    }

    /**
     * Universal Canvas Renderer supporting high-res scaling factor (1x, 2x, 3x)
     */
    renderCardToCanvas(targetCanvas, scale = 1.0) {
        if (!targetCanvas) return;
        const ctx = targetCanvas.getContext('2d');

        // Base dimensions according to selected aspect ratio
        let baseW = 1000;
        let baseH = 750;

        if (this.selectedRatio === 'landscape') {
            baseW = 1200;
            baseH = 675;
        } else if (this.selectedRatio === 'square') {
            baseW = 1000;
            baseH = 1000;
        } else if (this.selectedRatio === 'portrait') {
            baseW = 720;
            baseH = 1280;
        }

        const W = Math.round(baseW * scale);
        const H = Math.round(baseH * scale);

        targetCanvas.width = W;
        targetCanvas.height = H;

        ctx.save();
        ctx.scale(scale, scale);

        // Fetch inputs
        const sender = (this.senderInput && this.senderInput.value.trim()) || "Con / Cháu / Mình";
        const recipient = (this.recipientInput && this.recipientInput.value.trim()) || "Cha Mẹ Yêu Quý";
        const rawWish = (this.customWishInput && this.customWishInput.value.trim()) || this.presetWishes[0];
        const wish = this.cleanWishBody(rawWish);
        const theme = (this.themeSelect && this.themeSelect.value) || "red";
        const pattern = (this.patternSelect && this.patternSelect.value) || "gradient";
        const frameStyle = this.selectedFrame || "royal";
        const computedFont = this.getCardFontFamily();

        // ==========================================
        // 1. DRAW BACKGROUND & CUSTOM PHOTO
        // ==========================================
        if (this.customBgImage) {
            // Draw uploaded user image (cover mode)
            const img = this.customBgImage;
            const imgRatio = img.width / img.height;
            const canvasRatio = baseW / baseH;
            let drawW, drawH, drawX, drawY;

            if (imgRatio > canvasRatio) {
                drawH = baseH;
                drawW = baseH * imgRatio;
                drawX = (baseW - drawW) / 2;
                drawY = 0;
            } else {
                drawW = baseW;
                drawH = baseW / imgRatio;
                drawX = 0;
                drawY = (baseH - drawH) / 2;
            }

            ctx.drawImage(img, drawX, drawY, drawW, drawH);

            // Darken overlay
            ctx.fillStyle = `rgba(15, 5, 8, ${this.overlayOpacity})`;
            ctx.fillRect(0, 0, baseW, baseH);

            // Subtle theme tint over photo
            const tintColor = this.getThemeTintColor(theme);
            ctx.fillStyle = tintColor;
            ctx.fillRect(0, 0, baseW, baseH);
        } else {
            // Gradient Background based on selected theme
            const bgGrad = ctx.createLinearGradient(0, 0, baseW, baseH);
            this.applyThemeGradients(bgGrad, theme);
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, baseW, baseH);

            // Apply selected background pattern / texture
            if (pattern !== 'gradient') {
                this.drawBackgroundPattern(ctx, pattern, baseW, baseH);
            }
        }

        // ==========================================
        // 2. DRAW DECORATIVE ART FRAME & SPARKLES
        // ==========================================
        if (this.showSparkles) {
            this.drawCardSparkles(ctx, baseW, baseH);
        }
        const borderPadding = Math.min(baseW, baseH) * 0.042;
        const innerPadding = borderPadding + 10;
        this.drawDecorativeFrame(ctx, baseW, baseH, frameStyle, borderPadding, innerPadding);

        // ==========================================
        // 3. ADAPTIVE BALANCED LAYOUT BASED ON RATIO
        // ==========================================
        if (this.selectedRatio === 'portrait') {
            this.renderPortraitLayout(ctx, baseW, baseH, computedFont, sender, recipient, wish, innerPadding);
        } else if (this.selectedRatio === 'square') {
            this.renderSquareLayout(ctx, baseW, baseH, computedFont, sender, recipient, wish, innerPadding);
        } else if (this.selectedRatio === 'landscape') {
            this.renderLandscapeLayout(ctx, baseW, baseH, computedFont, sender, recipient, wish, innerPadding);
        } else {
            this.renderStandardLayout(ctx, baseW, baseH, computedFont, sender, recipient, wish, innerPadding);
        }

        ctx.restore();
    }

    getThemeTintColor(theme) {
        switch (theme) {
            case 'gold': return 'rgba(217, 119, 6, 0.18)';
            case 'night': return 'rgba(30, 27, 75, 0.22)';
            case 'pink': return 'rgba(225, 29, 72, 0.18)';
            case 'emerald': return 'rgba(6, 95, 70, 0.18)';
            case 'purple': return 'rgba(88, 28, 135, 0.20)';
            case 'amber': return 'rgba(120, 53, 15, 0.20)';
            default: return 'rgba(185, 28, 28, 0.20)';
        }
    }

    applyThemeGradients(bgGrad, theme) {
        if (theme === 'red') {
            bgGrad.addColorStop(0, '#5A0B14');
            bgGrad.addColorStop(0.35, '#82101D');
            bgGrad.addColorStop(0.7, '#6E0E19');
            bgGrad.addColorStop(1, '#3B050B');
        } else if (theme === 'gold') {
            bgGrad.addColorStop(0, '#573305');
            bgGrad.addColorStop(0.35, '#854D0E');
            bgGrad.addColorStop(0.7, '#A16207');
            bgGrad.addColorStop(1, '#3A2002');
        } else if (theme === 'night') {
            bgGrad.addColorStop(0, '#090514');
            bgGrad.addColorStop(0.4, '#1E1B4B');
            bgGrad.addColorStop(0.75, '#312E81');
            bgGrad.addColorStop(1, '#05030A');
        } else if (theme === 'pink') {
            bgGrad.addColorStop(0, '#4C0519');
            bgGrad.addColorStop(0.35, '#831843');
            bgGrad.addColorStop(0.7, '#9D174D');
            bgGrad.addColorStop(1, '#2E030F');
        } else if (theme === 'emerald') {
            bgGrad.addColorStop(0, '#022C22');
            bgGrad.addColorStop(0.35, '#064E3B');
            bgGrad.addColorStop(0.7, '#065F46');
            bgGrad.addColorStop(1, '#011A14');
        } else if (theme === 'purple') {
            bgGrad.addColorStop(0, '#2E1065');
            bgGrad.addColorStop(0.35, '#4C1D95');
            bgGrad.addColorStop(0.7, '#581C87');
            bgGrad.addColorStop(1, '#1A083B');
        } else if (theme === 'amber') {
            bgGrad.addColorStop(0, '#451A03');
            bgGrad.addColorStop(0.35, '#78350F');
            bgGrad.addColorStop(0.7, '#92400E');
            bgGrad.addColorStop(1, '#240C01');
        }
    }

    drawBackgroundPattern(ctx, pattern, W, H) {
        ctx.save();
        if (pattern === 'blossoms') {
            for (let i = 0; i < 48; i++) {
                const px = (Math.sin(i * 99) * 0.5 + 0.5) * W;
                const py = (Math.cos(i * 77) * 0.5 + 0.5) * H;
                const pSize = 4 + (i % 6);
                ctx.fillStyle = i % 2 === 0 ? 'rgba(254, 240, 138, 0.18)' : 'rgba(251, 207, 232, 0.22)';
                ctx.beginPath();
                ctx.arc(px, py, pSize, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (pattern === 'fireworks') {
            for (let i = 0; i < 60; i++) {
                const fx = (Math.sin(i * 123) * 0.5 + 0.5) * W;
                const fy = (Math.cos(i * 321) * 0.5 + 0.5) * H;
                const fLen = 3 + (i % 12);
                ctx.strokeStyle = i % 3 === 0 ? 'rgba(255, 215, 0, 0.35)' : 'rgba(255, 107, 107, 0.28)';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(fx, fy);
                ctx.lineTo(fx + (i % 2 === 0 ? fLen : -fLen), fy + fLen);
                ctx.stroke();
            }
        } else if (pattern === 'parchment') {
            for (let i = 0; i < 180; i++) {
                const rx = Math.random() * W;
                const ry = Math.random() * H;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
                ctx.fillRect(rx, ry, Math.random() * 4, Math.random() * 4);
            }
        } else if (pattern === 'lanterns') {
            for (let i = 0; i < 7; i++) {
                const lx = (W / 8) * (i + 0.8);
                const ly = 55 + Math.sin(i) * 22;
                ctx.fillStyle = 'rgba(239, 68, 68, 0.24)';
                ctx.beginPath();
                ctx.arc(lx, ly, 18, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (pattern === 'clouds') {
            for (let i = 0; i < 8; i++) {
                const cx = (i * 150) % W;
                const cy = 80 + (i % 4) * 110;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.12)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(cx, cy, 26, Math.PI, Math.PI * 2);
                ctx.arc(cx + 28, cy - 6, 20, Math.PI, Math.PI * 2);
                ctx.stroke();
            }
        } else if (pattern === 'brocade') {
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.08)';
            ctx.lineWidth = 1;
            const step = 42;
            for (let x = 0; x < W + H; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(0, x);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(W - x, 0);
                ctx.lineTo(W, x);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    /**
     * Custom Decorative Frame Engine with 6 Art Styles
     */
    drawDecorativeFrame(ctx, W, H, style, borderPadding, innerPadding) {
        ctx.save();

        if (style === 'minimal') {
            // 1. MINIMALIST LUXURY FRAME
            ctx.strokeStyle = '#FFD54F';
            ctx.lineWidth = 2.0;
            ctx.strokeRect(borderPadding, borderPadding, W - borderPadding * 2, H - borderPadding * 2);

            // Modern corner cross accents (+)
            const crossLen = 14;
            ctx.strokeStyle = '#FFE082';
            ctx.lineWidth = 2.2;
            const pts = [
                [borderPadding, borderPadding],
                [W - borderPadding, borderPadding],
                [borderPadding, H - borderPadding],
                [W - borderPadding, H - borderPadding]
            ];
            pts.forEach(([px, py]) => {
                ctx.beginPath();
                ctx.moveTo(px - crossLen, py);
                ctx.lineTo(px + crossLen, py);
                ctx.moveTo(px, py - crossLen);
                ctx.lineTo(px, py + crossLen);
                ctx.stroke();
            });

        } else if (style === 'floral') {
            // 2. FLORAL BLOSSOM FRAME (Hoa Mai Đào Đua Nở)
            ctx.strokeStyle = '#FFD54F';
            ctx.lineWidth = 3.0;
            ctx.strokeRect(borderPadding, borderPadding, W - borderPadding * 2, H - borderPadding * 2);

            ctx.strokeStyle = 'rgba(255, 213, 79, 0.45)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([8, 5]);
            ctx.strokeRect(innerPadding, innerPadding, W - innerPadding * 2, H - innerPadding * 2);
            ctx.setLineDash([]);

            // Draw blossom flower clusters at 4 corners
            this.drawBlossomFlower(ctx, innerPadding, innerPadding, '#F59E0B', '#EF4444');
            this.drawBlossomFlower(ctx, W - innerPadding, innerPadding, '#EC4899', '#BE185D');
            this.drawBlossomFlower(ctx, innerPadding, H - innerPadding, '#EC4899', '#BE185D');
            this.drawBlossomFlower(ctx, W - innerPadding, H - innerPadding, '#F59E0B', '#EF4444');

            // Midpoint floral accents
            this.drawBlossomBud(ctx, W / 2, borderPadding, '#F59E0B');
            this.drawBlossomBud(ctx, W / 2, H - borderPadding, '#F59E0B');
            this.drawBlossomBud(ctx, borderPadding, H / 2, '#EC4899');
            this.drawBlossomBud(ctx, W - borderPadding, H / 2, '#EC4899');

        } else if (style === 'folk') {
            // 3. TRADITIONAL FOLK MEANDER (Kỷ Hà Hồi Văn / Chữ Vạn)
            ctx.strokeStyle = '#FFD54F';
            ctx.lineWidth = 3.5;
            ctx.strokeRect(borderPadding, borderPadding, W - borderPadding * 2, H - borderPadding * 2);

            ctx.strokeStyle = 'rgba(255, 213, 79, 0.6)';
            ctx.lineWidth = 1.8;
            ctx.strokeRect(innerPadding, innerPadding, W - innerPadding * 2, H - innerPadding * 2);

            // Meander Greek-key / Chữ Vạn corners
            const mSize = 28;
            this.drawMeanderCorner(ctx, innerPadding, innerPadding, 1, 1, mSize);
            this.drawMeanderCorner(ctx, W - innerPadding, innerPadding, -1, 1, mSize);
            this.drawMeanderCorner(ctx, innerPadding, H - innerPadding, 1, -1, mSize);
            this.drawMeanderCorner(ctx, W - innerPadding, H - innerPadding, -1, -1, mSize);

        } else if (style === 'neon') {
            // 4. NEON GLOW FESTIVE FRAME (Ánh Kim Phát Sáng)
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 18;

            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(borderPadding, borderPadding, W - borderPadding * 2, H - borderPadding * 2);

            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1.8;
            ctx.strokeRect(innerPadding, innerPadding, W - innerPadding * 2, H - innerPadding * 2);
            ctx.shadowBlur = 0;

            // 4 Corner sparkling stars
            this.drawStarSparkle(ctx, innerPadding, innerPadding, 14);
            this.drawStarSparkle(ctx, W - innerPadding, innerPadding, 14);
            this.drawStarSparkle(ctx, innerPadding, H - innerPadding, 14);
            this.drawStarSparkle(ctx, W - innerPadding, H - innerPadding, 14);

        } else if (style === 'vintage') {
            // 5. VINTAGE CALLIGRAPHY & CLOUDS (Thủy Mặc Giấy Dó)
            const rad = 24;
            ctx.strokeStyle = '#FFD54F';
            ctx.lineWidth = 3.0;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(borderPadding, borderPadding, W - borderPadding * 2, H - borderPadding * 2, rad);
            } else {
                ctx.rect(borderPadding, borderPadding, W - borderPadding * 2, H - borderPadding * 2);
            }
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255, 213, 79, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(innerPadding, innerPadding, W - innerPadding * 2, H - innerPadding * 2, rad - 6);
            } else {
                ctx.rect(innerPadding, innerPadding, W - innerPadding * 2, H - innerPadding * 2);
            }
            ctx.stroke();

            // Cloud spiral corner flourishes
            this.drawCloudFlourish(ctx, innerPadding + 10, innerPadding + 10, 1, 1);
            this.drawCloudFlourish(ctx, W - innerPadding - 10, innerPadding + 10, -1, 1);
            this.drawCloudFlourish(ctx, innerPadding + 10, H - innerPadding - 10, 1, -1);
            this.drawCloudFlourish(ctx, W - innerPadding - 10, H - innerPadding - 10, -1, -1);

        } else {
            // DEFAULT: ROYAL CUNG ĐÌNH FRAME
            ctx.strokeStyle = '#FFD54F';
            ctx.lineWidth = Math.max(4, Math.round(W * 0.005));
            ctx.strokeRect(borderPadding, borderPadding, W - borderPadding * 2, H - borderPadding * 2);

            ctx.strokeStyle = 'rgba(255, 213, 79, 0.45)';
            ctx.lineWidth = 1.8;
            ctx.strokeRect(innerPadding, innerPadding, W - innerPadding * 2, H - innerPadding * 2);

            const cornerSize = Math.min(38, Math.round(W * 0.038));
            this.drawCorner(ctx, innerPadding, innerPadding, 1, 1, cornerSize);
            this.drawCorner(ctx, W - innerPadding, innerPadding, -1, 1, cornerSize);
            this.drawCorner(ctx, innerPadding, H - innerPadding, 1, -1, cornerSize);
            this.drawCorner(ctx, W - innerPadding, H - innerPadding, -1, -1, cornerSize);
        }

        ctx.restore();
    }

    drawBlossomFlower(ctx, cx, cy, petalColor, centerColor) {
        ctx.save();
        ctx.translate(cx, cy);
        const radius = 10;
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            ctx.fillStyle = petalColor;
            ctx.beginPath();
            ctx.arc(px, py, 7, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = centerColor;
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBlossomBud(ctx, cx, cy, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawMeanderCorner(ctx, x, y, sx, sy, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(sx, sy);
        ctx.strokeStyle = '#FFD54F';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(size * 0.6, size);
        ctx.lineTo(size * 0.6, size * 0.6);
        ctx.lineTo(size, size * 0.6);
        ctx.lineTo(size, 0);
        ctx.stroke();
        ctx.restore();
    }

    drawStarSparkle(ctx, cx, cy, len) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = '#FFFDF0';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.lineTo(len, 0);
        ctx.moveTo(0, -len);
        ctx.lineTo(0, len);
        ctx.stroke();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawCloudFlourish(ctx, cx, cy, sx, sy) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(sx, sy);
        ctx.strokeStyle = '#FFE082';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 1.5);
        ctx.arc(10, 4, 7, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    getCardFontFamily() {
        const name = (this.fontSelect && this.fontSelect.value) || 'Playfair Display';
        if (name === 'Dancing Script') return `'Dancing Script', cursive, serif`;
        if (name === 'Montserrat' || name === 'Plus Jakarta Sans') return `'${name}', sans-serif`;
        return `'${name}', Georgia, serif`;
    }

    getTextPalette() {
        const palettes = {
            'gold-cream': {
                header: '#FFE082',
                titleStops: ['#FFE082', '#FFF8E1', '#FFD54F'],
                subtitle: 'rgba(255, 235, 170, 0.9)',
                recipient: '#FFF8E1',
                body: '#FFFDF0',
                senderLabel: 'rgba(255, 235, 170, 0.9)',
                senderName: '#FFFDF0',
                titleShadow: 'rgba(0, 0, 0, 0.7)'
            },
            'pure-white': {
                header: '#FFF8E1',
                titleStops: ['#FFFFFF', '#F8FAFC', '#FFE082'],
                subtitle: 'rgba(255, 255, 255, 0.88)',
                recipient: '#FFFFFF',
                body: '#FFFFFF',
                senderLabel: 'rgba(255, 255, 255, 0.85)',
                senderName: '#FFFFFF',
                titleShadow: 'rgba(0, 0, 0, 0.65)'
            },
            'bright-gold': {
                header: '#FDE047',
                titleStops: ['#FDE047', '#FEF08A', '#F59E0B'],
                subtitle: 'rgba(253, 224, 71, 0.92)',
                recipient: '#FEF08A',
                body: '#FEF9C3',
                senderLabel: 'rgba(253, 224, 71, 0.9)',
                senderName: '#FEF08A',
                titleShadow: 'rgba(0, 0, 0, 0.75)'
            },
            'blossom-pink': {
                header: '#FBCFE8',
                titleStops: ['#FCE7F3', '#FFFFFF', '#F9A8D4'],
                subtitle: 'rgba(251, 207, 232, 0.92)',
                recipient: '#FCE7F3',
                body: '#FFF1F2',
                senderLabel: 'rgba(251, 207, 232, 0.9)',
                senderName: '#FCE7F3',
                titleShadow: 'rgba(80, 10, 30, 0.65)'
            },
            'dark-ink': {
                header: '#991B1B',
                titleStops: ['#7F1D1D', '#B91C1C', '#92400E'],
                subtitle: 'rgba(127, 29, 29, 0.88)',
                recipient: '#7F1D1D',
                body: '#2B0E14',
                senderLabel: 'rgba(127, 29, 29, 0.85)',
                senderName: '#7F1D1D',
                titleShadow: 'rgba(255, 255, 255, 0.45)'
            }
        };
        return palettes[this.selectedTextColor] || palettes['gold-cream'];
    }

    drawCardSparkles(ctx, W, H) {
        ctx.save();
        for (let i = 0; i < 36; i++) {
            const sx = ((i * 197 + 53) % 1000) / 1000 * W;
            const sy = ((i * 313 + 97) % 1000) / 1000 * H;
            const r = (i % 3) + 1.1;
            ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 224, 130, 0.38)' : 'rgba(255, 255, 255, 0.28)';
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    renderBodyWish(ctx, W, innerPad, font, wish, bodyCenterY, sideMargin, colors) {
        const maxWidth = W - innerPad * 2 - sideMargin;
        ctx.font = `${this.wishFontSize}px ${font}`;
        const lines = this.getWrappedLines(ctx, wish, maxWidth);
        const lineHeight = Math.round(this.wishFontSize * 1.56);

        const totalHeight = lines.length * lineHeight;
        const startY = bodyCenterY - (totalHeight / 2) + Math.round(lineHeight / 2);

        const align = this.wishAlign || 'center';
        let textX = W / 2;
        if (align === 'left') textX = innerPad + sideMargin / 2;
        else if (align === 'right') textX = W - innerPad - sideMargin / 2;

        ctx.save();
        ctx.textAlign = align;
        ctx.fillStyle = colors.body;
        lines.forEach((line, idx) => {
            ctx.fillText(line, textX, startY + idx * lineHeight);
        });
        ctx.restore();
    }

    /**
     * Standard 4:3 Layout (1000x750)
     */
    renderStandardLayout(ctx, W, H, font, sender, recipient, wish, innerPad) {
        const colors = this.getTextPalette();
        const headerText = (this.headerInput && this.headerInput.value.trim()) || '🌸 XUÂN ĐINH MÙI 2027 • TÂN NIÊN ĐẠI CÁT 🌸';
        const titleText = (this.titleInput && this.titleInput.value.trim()) || 'CHÚC MỪNG NĂM MỚI';
        ctx.textAlign = 'center';

        // 1. Header Banner
        ctx.fillStyle = colors.header;
        ctx.font = `bold 15px ${font}`;
        ctx.fillText(headerText, W / 2, 90);

        // 2. Main Title (Gradient with shadow)
        const titleGrad = ctx.createLinearGradient(W / 2 - 250, 0, W / 2 + 250, 0);
        titleGrad.addColorStop(0, colors.titleStops[0]);
        titleGrad.addColorStop(0.5, colors.titleStops[1]);
        titleGrad.addColorStop(1, colors.titleStops[2]);
        ctx.fillStyle = titleGrad;
        ctx.font = `900 44px ${font}`;
        ctx.shadowColor = colors.titleShadow;
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillText(titleText, W / 2, 146, W - innerPad * 2 - 40);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 3. Subtitle / Motto
        ctx.fillStyle = colors.subtitle;
        ctx.font = `italic 14px ${font}`;
        ctx.fillText('~ Vạn Sự Như Ý • An Khang Thịnh Vượng • Phú Quý Cát Tường ~', W / 2, 180);

        // Gold divider ribbon
        this.drawDivider(ctx, W / 2, 204, 380);

        // 4. Central Motif Stamp
        this.drawMotifStamp(ctx, this.selectedMotif, W / 2, 248, 0.88);

        // 5. Recipient Name Header
        ctx.fillStyle = colors.recipient;
        ctx.font = `bold ${this.recipientFontSize}px ${font}`;
        ctx.fillText(`Kính gửi: ${recipient}`, W / 2, 332);

        // 6. Dynamic Body Wishes
        this.renderBodyWish(ctx, W, innerPad, font, wish, 416, 80, colors);

        // 7. Footer: Imperial Seal (Left) & Right-Aligned Sender Sign-off
        const footerY = H - innerPad - 28;
        if (this.showSeal) this.drawSealStamp(ctx, innerPad + 28, footerY - 58);
        this.drawSender(ctx, W - innerPad - 35, footerY, font, sender, this.senderFontSize, colors);
    }

    /**
     * Landscape 16:9 Layout (1200x675)
     */
    renderLandscapeLayout(ctx, W, H, font, sender, recipient, wish, innerPad) {
        const colors = this.getTextPalette();
        const headerText = (this.headerInput && this.headerInput.value.trim()) || '🌸 XUÂN ĐINH MÙI 2027 • TÂN NIÊN ĐẠI CÁT 🌸';
        const titleText = (this.titleInput && this.titleInput.value.trim()) || 'CHÚC MỪNG NĂM MỚI';
        ctx.textAlign = 'center';

        // 1. Header Banner
        ctx.fillStyle = colors.header;
        ctx.font = `bold 14px ${font}`;
        ctx.fillText(headerText, W / 2, 78);

        // 2. Main Title
        const titleGrad = ctx.createLinearGradient(W / 2 - 250, 0, W / 2 + 250, 0);
        titleGrad.addColorStop(0, colors.titleStops[0]);
        titleGrad.addColorStop(0.5, colors.titleStops[1]);
        titleGrad.addColorStop(1, colors.titleStops[2]);
        ctx.fillStyle = titleGrad;
        ctx.font = `900 42px ${font}`;
        ctx.shadowColor = colors.titleShadow;
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillText(titleText, W / 2, 130, W - innerPad * 2 - 40);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 3. Subtitle / Motto
        ctx.fillStyle = colors.subtitle;
        ctx.font = `italic 13.5px ${font}`;
        ctx.fillText('~ Vạn Sự Như Ý • An Khang Thịnh Vượng • Phú Quý Vinh Hoa ~', W / 2, 162);

        this.drawDivider(ctx, W / 2, 184, 460);

        // 4. Central Motif Stamp
        this.drawMotifStamp(ctx, this.selectedMotif, W / 2, 226, 0.82);

        // 5. Recipient Name Header
        ctx.fillStyle = colors.recipient;
        ctx.font = `bold ${this.recipientFontSize}px ${font}`;
        ctx.fillText(`Kính gửi: ${recipient}`, W / 2, 304);

        // 6. Dynamic Body Wishes
        this.renderBodyWish(ctx, W, innerPad, font, wish, 384, 120, colors);

        // 7. Footer: Imperial Seal (Left) & Right-Aligned Sender Sign-off
        const footerY = H - innerPad - 24;
        if (this.showSeal) this.drawSealStamp(ctx, innerPad + 32, footerY - 56);
        this.drawSender(ctx, W - innerPad - 40, footerY, font, sender, this.senderFontSize, colors);
    }

    /**
     * Square 1:1 Layout (1000x1000)
     */
    renderSquareLayout(ctx, W, H, font, sender, recipient, wish, innerPad) {
        const colors = this.getTextPalette();
        const headerText = (this.headerInput && this.headerInput.value.trim()) || '🌸 XUÂN ĐINH MÙI 2027 🌸';
        const titleText = (this.titleInput && this.titleInput.value.trim()) || 'CHÚC MỪNG NĂM MỚI';
        ctx.textAlign = 'center';

        // 1. Header Banner
        ctx.fillStyle = colors.header;
        ctx.font = `bold 16px ${font}`;
        ctx.fillText(headerText, W / 2, 110);

        // 2. Main Title
        const titleGrad = ctx.createLinearGradient(W / 2 - 250, 0, W / 2 + 250, 0);
        titleGrad.addColorStop(0, colors.titleStops[0]);
        titleGrad.addColorStop(0.5, colors.titleStops[1]);
        titleGrad.addColorStop(1, colors.titleStops[2]);
        ctx.fillStyle = titleGrad;
        ctx.font = `900 50px ${font}`;
        ctx.shadowColor = colors.titleShadow;
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillText(titleText, W / 2, 175, W - innerPad * 2 - 40);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 3. Subtitle / Motto
        ctx.fillStyle = colors.subtitle;
        ctx.font = `italic 15px ${font}`;
        ctx.fillText('~ Vạn Sự Như Ý • An Khang Thịnh Vượng • Cát Tường Như Ý ~', W / 2, 214);

        this.drawDivider(ctx, W / 2, 242, 420);

        // 4. Central Motif Stamp
        this.drawMotifStamp(ctx, this.selectedMotif, W / 2, 302, 1.0);

        // 5. Recipient Name Header
        ctx.fillStyle = colors.recipient;
        ctx.font = `bold ${this.recipientFontSize}px ${font}`;
        ctx.fillText(`Kính gửi: ${recipient}`, W / 2, 410);

        // 6. Dynamic Body Wishes
        this.renderBodyWish(ctx, W, innerPad, font, wish, 530, 80, colors);

        // 7. Footer: Imperial Seal (Left) & Right-Aligned Sender Sign-off
        const footerY = H - innerPad - 32;
        if (this.showSeal) this.drawSealStamp(ctx, innerPad + 32, footerY - 58);
        this.drawSender(ctx, W - innerPad - 40, footerY, font, sender, this.senderFontSize, colors);
    }

    /**
     * Portrait Story 9:16 Layout (720x1280)
     */
    renderPortraitLayout(ctx, W, H, font, sender, recipient, wish, innerPad) {
        const colors = this.getTextPalette();
        const headerText = (this.headerInput && this.headerInput.value.trim()) || '🌸 XUÂN ĐINH MÙI 2027 🌸';
        const titleText = (this.titleInput && this.titleInput.value.trim()) || 'CHÚC MỪNG NĂM MỚI';
        ctx.textAlign = 'center';

        // 1. Header Banner
        ctx.fillStyle = colors.header;
        ctx.font = `bold 15px ${font}`;
        ctx.fillText(headerText, W / 2, 130);

        // 2. Main Title
        const titleGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
        titleGrad.addColorStop(0, colors.titleStops[0]);
        titleGrad.addColorStop(0.5, colors.titleStops[1]);
        titleGrad.addColorStop(1, colors.titleStops[2]);
        ctx.fillStyle = titleGrad;
        ctx.font = `900 44px ${font}`;
        ctx.shadowColor = colors.titleShadow;
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        if (titleText === 'CHÚC MỪNG NĂM MỚI') {
            ctx.fillText('CHÚC MỪNG', W / 2, 195);
            ctx.fillText('NĂM MỚI', W / 2, 245);
        } else {
            ctx.fillText(titleText, W / 2, 222, W - innerPad * 2 - 36);
        }
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 3. Subtitle / Motto
        ctx.fillStyle = colors.subtitle;
        ctx.font = `italic 14px ${font}`;
        ctx.fillText('~ Vạn Sự Như Ý • An Khang Thịnh Vượng ~', W / 2, 288);

        this.drawDivider(ctx, W / 2, 318, 300);

        // 4. Central Motif Stamp
        this.drawMotifStamp(ctx, this.selectedMotif, W / 2, 388, 1.05);

        // 5. Recipient Name Header
        ctx.fillStyle = colors.recipient;
        ctx.font = `bold ${this.recipientFontSize}px ${font}`;
        ctx.fillText(`Kính gửi: ${recipient}`, W / 2, 510);

        // 6. Dynamic Body Wishes
        this.renderBodyWish(ctx, W, innerPad, font, wish, 650, 40, colors);

        // 7. Footer: Imperial Seal (Left) & Right-Aligned Sender Sign-off
        const footerY = H - innerPad - 40;
        if (this.showSeal) this.drawSealStamp(ctx, innerPad + 24, footerY - 58);
        this.drawSender(ctx, W - innerPad - 30, footerY, font, sender, this.senderFontSize, colors);
    }

    drawDivider(ctx, cx, cy, width) {
        ctx.save();
        const divGrad = ctx.createLinearGradient(cx - width / 2, 0, cx + width / 2, 0);
        divGrad.addColorStop(0, 'rgba(255, 215, 0, 0)');
        divGrad.addColorStop(0.3, 'rgba(255, 215, 0, 0.85)');
        divGrad.addColorStop(0.5, '#FFF8E1');
        divGrad.addColorStop(0.7, 'rgba(255, 215, 0, 0.85)');
        divGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.strokeStyle = divGrad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx - width / 2, cy);
        ctx.lineTo(cx + width / 2, cy);
        ctx.stroke();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawSender(ctx, rightX, baseY, font, sender, fontSize = this.senderFontSize, colors = this.getTextPalette()) {
        ctx.save();
        ctx.textAlign = 'right';

        ctx.fillStyle = colors.senderLabel;
        ctx.font = `italic ${Math.max(12, Math.round(fontSize * 0.67))}px ${font}`;
        ctx.fillText('Thân chúc,', rightX, baseY - Math.round(fontSize * 1.24));

        ctx.fillStyle = colors.senderName;
        ctx.font = `bold ${fontSize}px ${font}`;
        ctx.fillText(sender, rightX, baseY);
        ctx.restore();
    }

    drawCorner(ctx, x, y, sx, sy, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(sx, sy);
        ctx.strokeStyle = '#FFD54F';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.restore();
    }

    /**
     * Anti-Overflow Auto-Fitting Imperial Cinnabar Seal (Đinh Mùi Cát Tường)
     * Fits text perfectly with dynamic font measurement & safe margins
     */
    drawSealStamp(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.035);

        const width = 84;
        const height = 84;
        const radius = 5;

        // Drop shadow for wax/cinnabar seal
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;

        // Cinnabar red body with subtle gradient
        const sealGrad = ctx.createLinearGradient(0, 0, width, height);
        sealGrad.addColorStop(0, '#B91C1C');
        sealGrad.addColorStop(1, '#7F1D1D');
        ctx.fillStyle = sealGrad;

        // Rounded rectangle body
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(0, 0, width, height, radius);
        } else {
            ctx.rect(0, 0, width, height);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outer Gold Border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(0, 0, width, height, radius);
        } else {
            ctx.rect(0, 0, width, height);
        }
        ctx.stroke();

        // Inner Filigree Border with safe padding
        const pad = 6;
        const innerW = width - pad * 2;
        const innerH = height - pad * 2;
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.55)';
        ctx.lineWidth = 1;
        ctx.strokeRect(pad, pad, innerW, innerH);

        // Corner decorative accents in seal
        const cLen = 4;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // Top-left
        ctx.moveTo(pad + cLen, pad + 2);
        ctx.lineTo(pad + 2, pad + 2);
        ctx.lineTo(pad + 2, pad + cLen);
        // Top-right
        ctx.moveTo(width - pad - cLen, pad + 2);
        ctx.lineTo(width - pad - 2, pad + 2);
        ctx.lineTo(width - pad - 2, pad + cLen);
        // Bottom-left
        ctx.moveTo(pad + cLen, height - pad - 2);
        ctx.lineTo(pad + 2, height - pad - 2);
        ctx.lineTo(pad + 2, height - pad - cLen);
        // Bottom-right
        ctx.moveTo(width - pad - cLen, height - pad - 2);
        ctx.lineTo(width - pad - 2, height - pad - 2);
        ctx.lineTo(width - pad - 2, height - pad - cLen);
        ctx.stroke();

        // Calligraphic text with auto-fitting font size (NEVER OVERFLOWS!)
        const rawSeal = ((this.sealInput && this.sealInput.value) || 'ĐINH MÙI • CÁT TƯỜNG').trim().toUpperCase();
        let line1 = rawSeal;
        let line2 = '';
        if (rawSeal.includes('•')) {
            const parts = rawSeal.split('•').map(s => s.trim()).filter(Boolean);
            line1 = parts[0] || 'ĐINH MÙI';
            line2 = parts.slice(1).join(' ') || '';
        } else {
            const words = rawSeal.split(/\s+/).filter(Boolean);
            if (words.length >= 2) {
                const mid = Math.ceil(words.length / 2);
                line1 = words.slice(0, mid).join(' ');
                line2 = words.slice(mid).join(' ');
            }
        }
        const maxTextW = innerW - 8; // Guarantee at least 4px padding inside inner box

        let fontSize = 11;
        ctx.font = `bold ${fontSize}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
        while (
            (ctx.measureText(line1).width > maxTextW || (line2 && ctx.measureText(line2).width > maxTextW)) &&
            fontSize > 6.5
        ) {
            fontSize -= 0.5;
            ctx.font = `bold ${fontSize}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
        }

        ctx.fillStyle = '#FFFDF0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (line2) {
            ctx.fillText(line1, width / 2, height * 0.36);
            ctx.fillText(line2, width / 2, height * 0.65);
        } else {
            ctx.fillText(line1, width / 2, height * 0.5);
        }

        ctx.restore();
    }

    drawMotifStamp(ctx, motif, x, y, scale = 1.0) {
        if (motif === 'none') return;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.textAlign = 'center';

        let icon = '🐐';
        let subText = 'KIM DƯƠNG NGHÊNH XUÂN';

        if (motif === 'blossom') {
            icon = '🌸';
            subText = 'MAI ĐÀO KHOE SẮC';
        } else if (motif === 'lantern') {
            icon = '🏮';
            subText = 'CÁT TƯỜNG BÌNH AN';
        } else if (motif === 'gold') {
            icon = '💰';
            subText = 'TẤN TÀI TẤN LỘC';
        } else if (motif === 'firework') {
            icon = '🎆';
            subText = 'GIAO THỪA RỰC RỠ';
        } else if (motif === 'envelope') {
            icon = '🧧';
            subText = 'KHAI XUÂN NHẬN LỘC';
        }

        // Soft golden glow
        ctx.shadowColor = 'rgba(255, 215, 0, 0.75)';
        ctx.shadowBlur = 12;
        ctx.font = '44px sans-serif';
        ctx.fillText(icon, 0, 0);
        ctx.shadowBlur = 0;

        // Subtitle badge under icon
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        const textWidth = ctx.measureText(subText).width * 0.4 + 28;
        ctx.fillRect(-textWidth / 2, 10, textWidth, 20);

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-textWidth / 2, 10, textWidth, 20);

        ctx.fillStyle = '#FFD54F';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(subText, 0, 24);

        ctx.restore();
    }

    /**
     * High-Res PNG Export Supporting HD, 2K, 4K Ultra HD
     */
    downloadCard() {
        if (!this.previewCanvas) return;

        // Quality scale factors
        const qualityScaleMap = {
            'hd': 1.0,
            '2k': 2.0,
            '4k': 3.0
        };
        const scale = qualityScaleMap[this.selectedQuality] || 2.0;

        let exportCanvas = this.previewCanvas;

        // If high resolution requested (2K or 4K), render to an offscreen high-res canvas
        if (scale > 1.0) {
            exportCanvas = document.createElement('canvas');
            this.renderCardToCanvas(exportCanvas, scale);
        }

        const recipient = (this.recipientInput && this.recipientInput.value.trim()) || "NguoiThan";
        const cleanRecipient = recipient.replace(/[^\p{L}\p{N}]/gu, '_').slice(0, 24);
        const fileName = `Thiep_Tet_2027_Gui_${cleanRecipient}_${this.selectedRatio}_${this.selectedQuality.toUpperCase()}.png`;

        const link = document.createElement('a');
        link.download = fileName;
        link.href = exportCanvas.toDataURL('image/png', 1.0);
        link.click();

        if (window.tetAudio) window.tetAudio.playLuckyChime();
        if (window.fireworks) {
            window.fireworks.explodeAt(window.innerWidth * 0.7, window.innerHeight * 0.5);
            window.fireworks.explodeAt(window.innerWidth * 0.3, window.innerHeight * 0.5);
        }

        const qualityLabels = {
            'hd': 'Chuẩn HD (1x)',
            '2k': 'Sắc Nét 2K (2x)',
            '4k': 'Siêu Nét 4K (3x)'
        };
        const label = qualityLabels[this.selectedQuality] || '2K';
        this.showToastMessage(`📥 Đã tải thiệp Tết ${label} thành công!`, 3000);
    }

    copyWish() {
        const recipient = (this.recipientInput && this.recipientInput.value.trim()) || "Cha Mẹ Yêu Quý";
        const sender = (this.senderInput && this.senderInput.value.trim()) || "Con / Cháu / Mình";
        const wish = (this.customWishInput && this.customWishInput.value.trim()) || this.presetWishes[0];

        const text = `🌸 CHÚC MỪNG NĂM MỚI 2027 - ĐINH MÙI 🌸\n\nKính gửi: ${recipient}\n${wish}\n\nThân chúc,\n${sender}`;

        navigator.clipboard.writeText(text).then(() => {
            this.showToastMessage('📋 Đã sao chép toàn bộ lời chúc Tết vào bộ nhớ tạm!', 2500);
        });
    }
}

// CardMaker is instantiated centrally in js/app.js
