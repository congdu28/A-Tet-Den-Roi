/**
 * Hệ Thống Xin Xăm Rút Quẻ Đinh Mùi 2027
 * 60 Quẻ Cát Tường đa dạng, phân loại chuẩn theo 6 nhóm ý nguyện (Toàn duyên, Công danh, Tài lộc, Tình duyên, Sức khỏe, Khoa cử)
 * Cơ chế rút quẻ không trùng lặp theo từng ý nguyện trong phiên (non-repeating bag + anti-consecutive repeat).
 */
class FortuneSystem {
    constructor() {
        this.selectedCategory = 'all';
        this.historyStorageKey = 'tet2027_fortune_history';
        this.drawnHistory = this.loadHistory();
        this.lastDrawnByCategory = {};
        this.toastTimer = null;

        this.fortunes = [
            {
                id: 1,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 01: THƯỢNG THƯỢNG ĐẠI CÁT",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Rồng bay mây biếc rạng trời xuân,\nPhú quý vinh hoa tự tại thân.\nVạn sự hanh thông đường rộng mở,\nĐinh Mùi vượng phát vạn niên tân.",
                career: "Thăng quan tiến chức, gặp quý nhân trọng dụng. Dự án lớn gặt hái thành công vang dội ngoài mong đợi.",
                wealth: "Tiền bạc dồi dào như nước chảy về nguồn, đầu tư sinh lời vượt bậc, lộc bất tận hưởng.",
                love: "Gia đạo an vui hòa thuận, tình duyên đơm hoa kết trái, người độc thân gặp được ý trung nhân.",
                health: "Tinh thần phấn chấn, thể chất dẻo dai sung mãn, bách bệnh tiêu tan.",
                study: "Trí tuệ hanh thông, thi cử đỗ đạt cao, dễ chạm tay tới học bổng và bảng vàng danh dự.",
                luckyNumber: "08 - 68 - 88",
                direction: "Xuất hành hướng Chính Nam đón Tài Thần chiếu mệnh."
            },
            {
                id: 2,
                category: ['career', 'love'],
                title: "QUẺ SỐ 02: TỬ KHÍ ĐÔNG LAI",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Phương đông nắng ấm rọi hiên nhà,\nHỷ khí tràn đầy khắp gần xa.\nCông danh sự nghiệp lên như gió,\nHạnh phúc sum vầy rạng sắc hoa.",
                career: "Có cơ hội đảm nhận trọng trách mới, khẳng định vị thế cá nhân trong tổ chức.",
                wealth: "Thu nhập ổn định và có thêm nguồn thu phụ bất ngờ từ các mối quan hệ tốt.",
                love: "Tình cảm sâu đậm gắn kết, đôi lứa thấu hiểu sẻ chia mọi vui buồn trong cuộc sống.",
                health: "Sức khỏe tốt, chú ý giữ ấm khi thời tiết chuyển mùa đầu năm.",
                study: "Gặp thầy giỏi bạn hiền dìu dắt, việc tiếp thu kiến thức mới nhanh nhạy và sâu sắc.",
                luckyNumber: "03 - 39 - 79",
                direction: "Xuất hành hướng Đông Nam để thu hút may mắn."
            },
            {
                id: 3,
                category: ['wealth'],
                title: "QUẺ SỐ 03: KIM NGỌC MÃN ĐƯỜNG",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Vàng ngọc đầy rương rực ánh xuân,\nKinh doanh thuận lợi phúc muôn phần.\nTài tinh soi sáng đường buôn bán,\nPhát lộc phát tài tiếng vang gần.",
                career: "Ký kết được những hợp đồng giá trị cao, đối tác tin tưởng hợp tác lâu dài.",
                wealth: "Vận tài chính thăng hoa rực rỡ nhất năm, thích hợp mở rộng quy mô hoặc tích lũy tài sản.",
                love: "Vợ chồng đồng tâm hiệp lực, cùng nhau xây dựng tổ ấm sung túc viên mãn.",
                health: "Cơ thể tràn đầy năng lượng, hạn chế thức khuya để duy trì phong độ.",
                study: "Các dự án nghiên cứu kinh tế, tài chính hoặc thực hành ứng dụng đạt kết quả xuất sắc.",
                luckyNumber: "06 - 26 - 86",
                direction: "Xuất hành hướng Đông Bắc cầu tài tất ứng."
            },
            {
                id: 4,
                category: ['love', 'health'],
                title: "QUẺ SỐ 04: ĐÀO HOA XUÂN SẮC",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Đào thắm mai vàng nở rộ sân,\nNhân duyên tiền định gặp tương phùng.\nTâm đầu ý hợp duyên thắm mãi,\nNgàn năm kết tóc nghĩa thủy chung.",
                career: "Môi trường làm việc thân thiện, được đồng nghiệp yêu mến hỗ trợ hết mình.",
                wealth: "Chi tiêu hợp lý, có lộc ăn uống và quà tặng từ bạn bè, người thân.",
                love: "Vận đào hoa nở rộ. Người đang yêu có tin vui hỷ sự, người cô đơn sớm tìm thấy tri kỷ.",
                health: "Tâm trạng vui vẻ lạc quan mang lại sức sống tràn trề và sắc diện tươi tắn.",
                study: "Học nhóm ăn ý, tham gia câu lạc bộ hay hoạt động ngoại khóa mở rộng nhiều kết nối quý.",
                luckyNumber: "02 - 22 - 52",
                direction: "Xuất hành hướng Chính Tây gặp Hỷ Thần phù trợ."
            },
            {
                id: 5,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 05: MÃ ĐÁO THÀNH CÔNG",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Tuấn mã phi nhanh vượt dặm trường,\nMang theo chiến thắng rạng muôn phương.\nBao năm vất vả nay thu hoạch,\nDanh lợi song toàn ngát tỏa hương.",
                career: "Chuyến đi xa công tác hoặc dự án dài hơi đạt kết quả mỹ mãn, danh tiếng vang xa.",
                wealth: "Bứt phá doanh thu ngoạn mục, công sức bỏ ra được đền đáp xứng đáng.",
                love: "Dù bận rộn nhưng tình cảm luôn bền chặt nhờ sự tin tưởng tuyệt đối.",
                health: "Thể lực dồi dào, nên duy trì thói quen vận động thể thao hàng ngày.",
                study: "Bứt tốc đúng giai đoạn nước rút, các kỳ thi quan trọng đều vượt qua gọn gàng.",
                luckyNumber: "09 - 19 - 99",
                direction: "Xuất hành hướng Tây Nam rước lộc về nhà."
            },
            {
                id: 6,
                category: ['health', 'all'],
                title: "QUẺ SỐ 06: THUẬN BUỒM XUÔI GIÓ",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Gió thuận buồm căng lướt sóng xanh,\nKhó khăn tan biến hóa an lành.\nChậm mà chắc chắn đường đi tới,\nHậu vận huy hoàng tựa bức tranh.",
                career: "Mọi kế hoạch tiến triển đều đặn, ít gặp trở ngại, từng bước chinh phục mục tiêu.",
                wealth: "Nguồn tài chính ổn định và tăng trưởng bền vững theo thời gian.",
                love: "Mối quan hệ êm đềm, không sóng gió, sự chân thành giữ lửa hạnh phúc bền lâu.",
                health: "Bình an vô sự, sức khỏe dồi dào, tâm hồn thanh thản tự tại.",
                study: "Giữ nhịp ôn luyện đều mỗi ngày giúp kiến thức thấm sâu, tránh áp lực phút chót.",
                luckyNumber: "04 - 14 - 44",
                direction: "Xuất hành hướng Chính Bắc đón quý nhân giúp sức."
            },
            {
                id: 7,
                category: ['wealth', 'all'],
                title: "QUẺ SỐ 07: PHÚC LỘC SONG TOÀN",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Phúc đức tràn đầy ấm mái nhà,\nLộc trời ban xuống tựa ngàn hoa.\nBình an hưởng trọn mùa xuân thắm,\nCon cháu thảo hiền rạng nếp gia.",
                career: "Uy tín cá nhân nâng cao, được cấp trên tin tưởng giao phó những vị trí then chốt.",
                wealth: "Tiền vào như nước, có cơ hội sở hữu tài sản có giá trị lớn trong năm.",
                love: "Gia đình sum vầy hạnh phúc, đón thêm tin vui về con cái hoặc hỷ sự.",
                health: "Trường thọ khang ninh, không âu lo phiền muộn.",
                study: "Gia đình là điểm tựa vững vàng giúp an tâm trau dồi tri thức và gặt hái thành tích.",
                luckyNumber: "12 - 24 - 99",
                direction: "Xuất hành hướng Đông đón ánh bình minh đại cát."
            },
            {
                id: 8,
                category: ['study', 'career'],
                title: "QUẺ SỐ 08: KHOA BẢNG KHÔI NGUYÊN",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Bút nghiên rèn luyện mấy mùa đông,\nBảng vàng nay khắc rạng non sông.\nCá hóa rồng bay vờn sóng bạc,\nRạng danh gia tộc thỏa hoài mong.",
                career: "Bảo vệ xuất sắc đề án, thăng ngạch chuyên môn hoặc chuyển hướng nghề nghiệp rực rỡ.",
                wealth: "Nhận được tài trợ, giải thưởng hoặc học bổng có giá trị tài chính lớn.",
                love: "Được bạn bè cùng chí hướng quý mến, kết giao tri kỷ học thức uyên bác.",
                health: "Chú ý bồi bổ thị lực và ngủ đủ giấc sau những ngày dùi mài kinh sử.",
                study: "Thi cử đỗ đạt thủ khoa, xin học bổng thành công, bảng vàng ghi danh rạng rỡ.",
                luckyNumber: "01 - 10 - 100",
                direction: "Xuất hành hướng Chính Đông gặp quý nhân học vấn."
            },
            {
                id: 9,
                category: ['love', 'health'],
                title: "QUẺ SỐ 09: NGŨ PHÚC LÂM MÔN",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Năm phúc cùng về trước cửa nhà:\nThọ - Phú - Khang - Ninh lẫn Đức hoa.\nCon cháu thảo hiền vui họp mặt,\nXuân sang thắm đượm nghĩa êm hòa.",
                career: "Gia đình làm ăn phát đạt, con cháu kế nghiệp vẻ vang, nội bộ tương trợ lẫn nhau.",
                wealth: "Tài lộc vững bền, tích lũy vững chắc cho nhiều năm tiếp theo.",
                love: "Gia đình đoàn viên tưng bừng, đón tin hỷ cưới hỏi hoặc thêm thành viên mới.",
                health: "Cả nhà mạnh khỏe, bậc cao niên trường thọ, trẻ nhỏ thông minh hoạt bát.",
                study: "Môi trường gia phong nề nếp giúp việc học hành tiến bộ vượt bậc.",
                luckyNumber: "05 - 55 - 95",
                direction: "Xuất hành hướng Nam nghênh đón Hỷ Thần bảo trợ."
            },
            {
                id: 10,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 10: TỌA THƯỢNG PHONG VÂN",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Gặp thời vẫy cánh giữa tầng mây,\nKhởi dựng cơ đồ vững chắc tay.\nBè bạn muôn nơi cùng góp sức,\nThành công vang dội tháng năm này.",
                career: "Ý tưởng khởi nghiệp được rót vốn, dự án mới vận hành trơn tru và tạo dấu ấn mạnh mẽ.",
                wealth: "Lợi nhuận vượt mức mong đợi, mở ra nhiều cơ hội đầu tư sinh lời bền vững.",
                love: "Gặp được bạn đồng hành thấu hiểu, chia sẻ ngọt bùi và cổ vũ ước mơ lớn.",
                health: "Duy trì lịch tập thể dục đều đặn để giữ vững nguồn năng lượng đỉnh cao.",
                study: "Nghiên cứu ứng dụng và thi tuyển chuyên ngành mới đều đạt điểm cao ấn tượng.",
                luckyNumber: "03 - 33 - 77",
                direction: "Xuất hành hướng Tây Bắc gặp quý nhân dẫn lối."
            },
            {
                id: 11,
                category: ['love'],
                title: "QUẺ SỐ 11: LONG PHỤNG TRÌNH TƯỜNG",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Rồng bay phượng múa giữa trời thanh,\nSe kết tơ duyên đượm ý lành.\nMột dạ sắt son cùng gắn bó,\nTrọn đời son sắt mãi đồng hành.",
                career: "Hậu phương vững chắc tiếp thêm đôi cánh cho sự nghiệp thăng hoa vượt bậc.",
                wealth: "Vợ chồng chung lưng đấu cật, đồng lòng gây dựng cơ ngơi sung túc.",
                love: "Duyên phận an bài đẹp tựa bài thơ, tiến tới hôn nhân viên mãn, tình cảm sắc son.",
                health: "Tinh thần thảnh thơi, sắc mặt hồng hào, hạnh phúc lan tỏa đến mọi người.",
                study: "Tình cảm êm đẹp tạo động lực tinh thần mạnh mẽ để tập trung chinh phục mục tiêu học vấn.",
                luckyNumber: "02 - 22 - 82",
                direction: "Xuất hành hướng Đông Nam để rước hỷ khí vào nhà."
            },
            {
                id: 12,
                category: ['health'],
                title: "QUẺ SỐ 12: BÌNH AN ĐẠI CÁT",
                grade: "BÌNH AN CÁT TƯỜNG ★★★★☆",
                poem: "Bình an là phúc lớn trần gian,\nChẳng chút ưu tư dạ nhẹ nhàng.\nSáng sớm nhấp trà nghe én hót,\nChiều về thanh thản ánh xuân sang.",
                career: "Mọi công việc diễn ra êm đềm, không gặp thị phi trắc trở, môi trường an lành.",
                wealth: "Tài chính đủ đầy sung túc, không nợ nần, cuộc sống tự do tự tại.",
                love: "Các mối quan hệ thân tình, không vướng bận tranh cãi, gia đạo bình an vô sự.",
                health: "Cơ thể dẻo dai khỏe mạnh, thân tâm thanh tịnh, ngủ ngon giấc trọn đêm.",
                study: "Tâm trí tĩnh tại giúp khả năng tập trung và ghi nhớ đạt hiệu suất cao.",
                luckyNumber: "04 - 44 - 84",
                direction: "Xuất hành hướng Chính Tây gặp sao Phúc Tinh."
            },
            {
                id: 13,
                category: ['wealth'],
                title: "QUẺ SỐ 13: TÀI NGUYÊN QUẢNG TIẾN",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Ngọc biếc vàng son rực rỡ nhà,\nLộc xuân tươi thắm sắc ngàn hoa.\nKinh doanh thuận buồm xuôi nước ngọt,\nPhú quý vinh hoa khắp cõi xa.",
                career: "Doanh số nhảy vọt, ký kết nhiều dự án mang về doanh thu hàng đầu trong năm.",
                wealth: "Tiền tài dồi dào, tài sản tích sản gia tăng, dễ gặp vận may tài chính bất ngờ.",
                love: "Cuộc sống gia đình sung túc, đủ điều kiện chăm lo chu đáo cho các thế hệ.",
                health: "Sức khỏe sung mãn, tâm trạng vui tươi phấn chấn mỗi sớm mai thức dậy.",
                study: "Đầu tư vào sách vở, khóa học nâng cao chuyên môn sẽ sinh lợi lâu dài.",
                luckyNumber: "19 - 79 - 89",
                direction: "Xuất hành hướng Chính Nam rước Thần Tài vào nhà."
            },
            {
                id: 14,
                category: ['career', 'study'],
                title: "QUẺ SỐ 14: XUÂN PHONG ĐẮC Ý",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Gió xuân mơn man lướt áo hoa,\nMọi việc hanh thông khắp xứ xa.\nNgẩng đầu cười lớn vang trời đất,\nVinh hiển rạng soi lối bước qua.",
                career: "Được lãnh đạo ghi nhận, thăng tiến vùn vụt, có cơ hội đi công tác mở mang tầm nhìn.",
                wealth: "Thu nhập tăng trưởng lũy tiến, các khoản đầu tư sinh lời đều đặn.",
                love: "Được nhiều người ngưỡng mộ và quý mến, gia đạo tràn đầy tiếng cười.",
                health: "Sức đề kháng cực tốt, tràn ngập năng lượng tích cực.",
                study: "Tư duy sáng suốt, dễ đạt giải cao trong các kỳ thi học thuật và sáng tạo.",
                luckyNumber: "15 - 51 - 91",
                direction: "Xuất hành hướng Đông Bắc đón gió lành may mắn."
            },
            {
                id: 15,
                category: ['career', 'study'],
                title: "QUẺ SỐ 15: NHẤT PHI TRÙNG THIÊN",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Bao năm tích lũy chí chưa vơi,\nNay cánh chim bằng vút cõi khơi.\nBứt phá ngoạn mục lên đỉnh chóp,\nVang danh bốn bể rạng phương trời.",
                career: "Vượt qua thử thách một cách thần kỳ, biến nguy thành cơ, bước lên tầm cao mới.",
                wealth: "Thu hoạch lớn từ những nỗ lực bền bỉ bấy lâu nay, tài vận nhảy bậc vững bền.",
                love: "Sự tự tin và bản lĩnh giúp bạn tỏa sáng, thu hút nhân duyên xứng tầm.",
                health: "Thể chất tràn đầy phong độ, sẵn sàng chinh phục những cột mốc cao hơn.",
                study: "Bứt phá điểm số ngoạn mục, đỗ vào ngôi trường hoặc ngành học mơ ước.",
                luckyNumber: "07 - 77 - 97",
                direction: "Xuất hành hướng Tây Nam đón cát khí thiên địa."
            },
            {
                id: 16,
                category: ['career', 'love'],
                title: "QUẺ SỐ 16: QUÝ NHÂN TƯƠNG HỖ",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Đi đâu cũng gặp người đưa lối,\nKhó khăn lập tức hóa mây bay.\nÂn tình sâu nặng muôn phương gửi,\nẤm áp nghĩa nhân tháng lại ngày.",
                career: "Lúc ngặt nghèo có người xuất hiện gỡ rối, được chỉ bảo bí quyết nhà nghề quý giá.",
                wealth: "Được người đáng tin cậy mách nước kinh doanh, kiếm tiền thuận lợi dễ dàng.",
                love: "Gặp được tri kỷ nâng đỡ tinh thần, cùng nhau sẻ chia buồn vui cuộc sống.",
                health: "Nhờ giữ tâm thiện lành mà thân thể an ổn, ít đau ốm bệnh tật vặt vãnh.",
                study: "Được tiền bối tận tình hướng dẫn đề tài, mở lối thoát cho những bài toán khó.",
                luckyNumber: "13 - 31 - 83",
                direction: "Xuất hành hướng Chính Đông gặp sao Thiên Đức."
            },
            {
                id: 17,
                category: ['love', 'health'],
                title: "QUẺ SỐ 17: HOAN HỶ ĐOÀN VIÊN",
                grade: "BÌNH AN CÁT TƯỜNG ★★★★☆",
                poem: "Bếp lửa reo vui đón Tết về,\nBánh chưng thơm ngát ấm miền quê.\nCả nhà sum họp cười rạng rỡ,\nTrọn vẹn tình thâm thỏa ước thề.",
                career: "Công việc ổn thỏa giúp bạn dành nhiều thời gian quý báu cho gia đình.",
                wealth: "Tài chính vững vàng, đủ điều kiện lo cho người thân cuộc sống tiện nghi.",
                love: "Mọi hiểu lầm cũ tan biến, tình thân keo sơn, chan chứa yêu thương.",
                health: "Tâm lý thoải mái, gia đình vui vẻ là phương thuốc bổ quý nhất cho sức khỏe.",
                study: "Nhận được sự động viên lớn từ cha mẹ, tinh thần học tập hứng khởi vững tin.",
                luckyNumber: "14 - 41 - 94",
                direction: "Xuất hành hướng Nam nghênh đón cát tường."
            },
            {
                id: 18,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 18: VẠN TƯỢNG CANH TÂN",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Trút bỏ bụi mờ của tháng qua,\nBình minh rực rỡ đón xuân hoa.\nKhởi đầu chương mới bao điều lạ,\nThắng lợi huy hoàng rạng gấm hoa.",
                career: "Chuyển mình mạnh mẽ, áp dụng phương pháp mới tạo hiệu suất vượt trội.",
                wealth: "Tìm ra nguồn thu nhập mới đầy tiềm năng, kinh tế từng bước khởi sắc.",
                love: "Tình cảm được làm mới qua những trải nghiệm cùng nhau, thêm phần gắn bó.",
                health: "Thay đổi thói quen sinh hoạt lành mạnh giúp cơ thể khỏe khoắn dẻo dai hơn.",
                study: "Đổi mới phương pháp ghi chép và tư duy hệ thống mang lại tiến bộ rõ rệt.",
                luckyNumber: "11 - 61 - 81",
                direction: "Xuất hành hướng Đông Nam đón luồng sinh khí mới."
            },
            {
                id: 19,
                category: ['study', 'career'],
                title: "QUẺ SỐ 19: CÁ CHÉP HÓA RỒNG",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Vượt ngọn sóng cao dẫu nhọc nhằn,\nVươn mình hóa bóng phượng rồng lân.\nĐạp mây cưỡi gió bay muôn lối,\nKhắc dấu tài năng giữa thế trần.",
                career: "Vượt qua kỳ sát hạch gắt gao, nâng tầm vị thế chuyên gia được nể trọng.",
                wealth: "Thu nhập tăng vọt tương xứng với năng lực và cấp bậc mới.",
                love: "Tìm được người thấu hiểu và trân trọng sự nỗ lực bền bỉ của bạn.",
                health: "Giải tỏa áp lực thi cử, cơ thể thư thái, tràn đầy sức sống thanh xuân.",
                study: "Vượt Vũ Môn thành công rực rỡ, giành chứng chỉ quốc tế hoặc học vị mơ ước.",
                luckyNumber: "09 - 49 - 99",
                direction: "Xuất hành hướng Chính Bắc đón sao Thiên Hỷ."
            },
            {
                id: 20,
                category: ['wealth', 'love'],
                title: "QUẺ SỐ 20: ĐỨC TÀI VIÊN MÃN",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Sống thuận lòng nhân đất nở hoa,\nPhúc dày đức rộng đến muôn nhà.\nTrời ban phúc lộc người thơm thảo,\nMột cõi an bình mãi ngát xa.",
                career: "Làm việc bằng cái tâm trong sáng nên được cộng đồng và đối tác kính trọng.",
                wealth: "Càng rộng lòng sẻ chia và giữ chữ tín thì tài lộc càng sinh sôi bền lâu.",
                love: "Gia đình trên dưới một lòng, con cháu noi gương sống nhân hậu thành tài.",
                health: "Tâm an thì bệnh tật tiêu tan, cuộc sống an nhiên trường thọ vô ưu.",
                study: "Học đi đôi với hành và đạo đức nghề nghiệp giúp tiến xa bền vững.",
                luckyNumber: "17 - 57 - 87",
                direction: "Xuất hành hướng Chính Tây nghênh đón cát tinh."
            },
            {
                id: 21,
                category: ['wealth', 'career'],
                title: "QUẺ SỐ 21: THỜI VẬN ĐẮC THẾ",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Gặp lúc cờ trao phải phất ngay,\nThời cơ vàng ngọc chớ buông tay.\nTài năng ấp ủ nay bừng sáng,\nThắng lợi giòn giã đẹp mắt thay.",
                career: "Bắt đúng xu hướng thị trường, dẫn dắt đổi mới, gặt hái thành công vượt trội.",
                wealth: "Lợi nhuận đến từ nhiều nguồn, dòng tiền lưu thông dồi dào.",
                love: "Tình cảm đôi lứa thăng hoa, cùng nhau tận hưởng thành quả ngọt ngào.",
                health: "Tràn đầy khí thế, thể lực sung mãn, tinh thần hăng hái.",
                study: "Chọn đúng lĩnh vực mũi nhọn, học một hiểu mười, sớm khẳng định năng lực.",
                luckyNumber: "21 - 71 - 88",
                direction: "Xuất hành hướng Đông Nam đón lộc đầu xuân."
            },
            {
                id: 22,
                category: ['all'],
                title: "QUẺ SỐ 22: TÂM THÀNH Ý TOẠI",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Thành tâm hướng thiện đón xuân tươi,\nCầu lộc cầu tài thỏa ước đời.\nVạn sự hanh thông như ý nguyện,\nNụ cười rạng rỡ nở trên môi.",
                career: "Những ước vọng ấp ủ bấy lâu nay đều lần lượt trở thành hiện thực viên mãn.",
                wealth: "Tài chính dồi dào, giải quyết êm đẹp mọi kế hoạch kinh tế.",
                love: "Cầu duyên được duyên, gia đạo hòa thuận trăm năm gắn bó.",
                health: "Thân tâm an lạc, tràn trề sinh lực, tinh thần lạc quan phơi phới.",
                study: "Nguyện vọng học tập đặt ra từ đầu năm đều có cơ hội chạm đích như ý.",
                luckyNumber: "23 - 63 - 93",
                direction: "Xuất hành hướng Chính Đông đón ánh bình minh khai vận."
            },
            {
                id: 23,
                category: ['health'],
                title: "QUẺ SỐ 23: DIÊN NIÊN ÍCH THỌ",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Thân như bách diệp giữa ngàn phong,\nDẻo dai đứng vững giữa tầng không.\nKhí huyết lưu thông tràn nhựa sống,\nXuân về thọ dưỡng ấm cõi lòng.",
                career: "Đầu óc minh mẫn, đưa ra những quyết sách sáng suốt giúp tập thể tiến xa.",
                wealth: "Tích lũy tài sản vững chãi cho tương lai, cuộc sống an nhàn tự tại.",
                love: "Con cháu sum vầy phụng dưỡng, gia đình tràn ngập tiếng cười.",
                health: "Sức khỏe dẻo dai bền bỉ, khí huyết lưu thông, tinh thần sảng khoái.",
                study: "Trí nhớ bền bỉ, thích hợp nghiên cứu chuyên sâu các đề tài dài hạn.",
                luckyNumber: "25 - 65 - 85",
                direction: "Xuất hành hướng Nam rước dương khí an khang."
            },
            {
                id: 24,
                category: ['wealth', 'career'],
                title: "QUẺ SỐ 24: BÁCH NGHIỆP HƯNG THỊNH",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Trăm nghề trăm nghiệp bước vào xuân,\nMua bán giao thương nhộn nhịp dần.\nUy tín tạo nên nguồn của cải,\nVinh hoa phú quý rạng muôn phần.",
                career: "Xây dựng uy tín vững chắc, khách hàng và đối tác tin tưởng gắn bó dài lâu.",
                wealth: "Doanh thu tăng trưởng rõ rệt, vốn lưu động dồi dào, mở rộng đầu tư thuận lợi.",
                love: "Được gia đình và bạn bè ủng hộ nhiệt thành trên con đường phát triển.",
                health: "Chú ý cân bằng giữa công việc và nghỉ ngơi để giữ phong độ dài lâu.",
                study: "Học hỏi kỹ năng quản trị và thực chiến giúp sớm gặt hái thành quả thực tế.",
                luckyNumber: "29 - 69 - 89",
                direction: "Xuất hành hướng Tây Bắc đón thần may mắn trợ vận."
            },
            {
                id: 25,
                category: ['study'],
                title: "QUẺ SỐ 25: VĂN XƯƠNG CHIẾU MỆNH",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Sao Văn Xương sáng giữa trời xuân,\nKhai mở trí minh vạn sự thông.\nChữ nghĩa tinh anh ngòi bút sắc,\nCông thành danh toại rạng non sông.",
                career: "Lĩnh vực tri thức, giảng dạy, viết lách hay công nghệ có bước tiến nổi bật.",
                wealth: "Kiếm tiền từ chất xám, bản quyền và năng lực chuyên môn ngày càng dồi dào.",
                love: "Dễ gặp người tri âm đồng điệu về tâm hồn và tư duy.",
                health: "Giữ tinh thần thư giãn, tránh ngồi quá lâu trước màn hình không nghỉ.",
                study: "Sao Văn Xương chiếu sáng rực rỡ: ôn đâu trúng đó, thi cử đạt điểm xuất sắc.",
                luckyNumber: "01 - 18 - 68",
                direction: "Xuất hành hướng Đông Bắc để khai thông trí tuệ."
            },
            {
                id: 26,
                category: ['study', 'all'],
                title: "QUẺ SỐ 26: ĐĂNG KHOA BẢNG VÀNG",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Mười năm đèn sách chẳng phụ công,\nXuân này bảng hổ rạng tên hồng.\nTự tin vững bước đường tri thức,\nHoa nở thềm son thỏa ước mong.",
                career: "Mở cánh cửa nghề nghiệp mơ ước sau quá trình trau dồi nghiêm túc.",
                wealth: "Có thưởng nóng hoặc đãi ngộ cao nhờ thành tích nổi bật.",
                love: "Niềm vui thành đạt lan tỏa, gia đình tự hào hãnh diện.",
                health: "Ăn uống điều độ, bổ sung dinh dưỡng trí não để duy trì sức bền.",
                study: "Bảo vệ luận văn, thi chứng chỉ hay xét tuyển đại học đều suôn sẻ đỗ đạt.",
                luckyNumber: "05 - 25 - 75",
                direction: "Xuất hành hướng Chính Đông cầu học vấn tất đạt."
            },
            {
                id: 27,
                category: ['study'],
                title: "QUẺ SỐ 27: TÍCH THỦY THÀNH UYÊN",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Giọt nhỏ lâu ngày hóa biển sâu,\nKiên trì bền chí ắt đứng đầu.\nChớ nản đường xa nhiều dốc núi,\nQua mùa hạ tới sẽ thu giàu.",
                career: "Kinh nghiệm tích lũy từng ngày giúp bạn trở thành trụ cột không thể thay thế.",
                wealth: "Tiền bạc tích tiểu thành đại, cuối năm tổng kết dư dả bất ngờ.",
                love: "Tình cảm bồi đắp từ sự quan tâm chân thành mỗi ngày, càng lâu càng đậm sâu.",
                health: "Rèn luyện thói quen nhỏ như đi bộ và uống đủ nước mang lại lợi ích lớn.",
                study: "Kiên trì ôn luyện nền tảng vững chắc, nửa cuối năm điểm số tăng vọt rõ rệt.",
                luckyNumber: "07 - 27 - 67",
                direction: "Xuất hành hướng Chính Bắc gặp người chỉ dẫn tận tâm."
            },
            {
                id: 28,
                category: ['study', 'career'],
                title: "QUẺ SỐ 28: TRÍ TUỆ KHAI MINH",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Mây mù tan biến lộ trăng thanh,\nÝ tưởng dạt dào tựa suối xanh.\nSáng tạo mở đường đi phía trước,\nViệc khó rồi đây cũng hóa lành.",
                career: "Đề xuất sáng kiến đột phá được tập thể đánh giá cao và đưa vào áp dụng.",
                wealth: "Khai thác được hướng đi mới ít cạnh tranh nhưng lợi nhuận tốt.",
                love: "Biết lắng nghe và thấu hiểu giúp hóa giải mọi khúc mắc nhỏ.",
                health: "Thiền định hoặc nghe nhạc nhẹ giúp đầu óc luôn tỉnh táo minh mẫn.",
                study: "Tìm ra phương pháp học thông minh, rút ngắn một nửa thời gian mà hiệu quả tăng đôi.",
                luckyNumber: "08 - 28 - 78",
                direction: "Xuất hành hướng Đông Nam đón linh cảm sáng tạo."
            },
            {
                id: 29,
                category: ['study'],
                title: "QUẺ SỐ 29: HỌC HẢI VÔ NHAI",
                grade: "TIỂU CÁT KHỞI SẮC ★★★★☆",
                poem: "Biển học mênh mông rộng bốn bề,\nChuyên cần rèn giũa chớ sao nhãng.\nKhiêm nhường học hỏi từ muôn phía,\nẮt có ngày vui rạng nẻo về.",
                career: "Chủ động cập nhật kỹ năng mới giúp bạn vượt lên trước đồng nghiệp.",
                wealth: "Đừng vội đầu tư vào lĩnh vực chưa hiểu rõ; học kỹ trước khi xuống tiền sẽ thắng.",
                love: "Sự điềm đạm và cầu tiến tạo thiện cảm sâu sắc với người đối diện.",
                health: "Ngủ sớm trước 23h để bảo toàn trí nhớ và sức khỏe lâu dài.",
                study: "Giữ thái độ khiêm tốn, chăm hỏi thầy bạn sẽ lấp đầy mọi lỗ hổng kiến thức.",
                luckyNumber: "04 - 29 - 64",
                direction: "Xuất hành hướng Chính Tây gặp bạn học tri kỷ."
            },
            {
                id: 30,
                category: ['study', 'wealth'],
                title: "QUẺ SỐ 30: TÀI TRÍ SONG HÀNH",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Trí sáng như gương chẳng nhuốm trần,\nTài cao đức trọng quý vô ngần.\nHọc hành đỗ đạt đi đôi lộc,\nMột bước lên mây rạng sắc xuân.",
                career: "Vừa giỏi chuyên môn vừa khéo ứng xử nên thăng tiến rất nhanh.",
                wealth: "Tri thức chuyển hóa trực tiếp thành thu nhập cao và cơ hội hợp tác lớn.",
                love: "Gặp người môn đăng hộ đối cả về tâm hồn lẫn tầm nhìn tương lai.",
                health: "Cân bằng tốt giữa lao động trí óc và thư giãn ngoài trời.",
                study: "Dễ săn được học bổng toàn phần hoặc giải thưởng nghiên cứu có giá trị cao.",
                luckyNumber: "10 - 30 - 90",
                direction: "Xuất hành hướng Tây Bắc đón vận quý nhân."
            },
            {
                id: 31,
                category: ['health'],
                title: "QUẺ SỐ 31: TÙNG BÁCH TRƯỜNG XUÂN",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Cây tùng đứng thẳng giữa sương mai,\nGió bão chẳng lay gốc vững hoài.\nThân khỏe tâm an không vướng bận,\nXuân sang phúc thọ nối dài mãi.",
                career: "Sức bền tâm lý tốt giúp bạn đứng vững trước mọi biến động thị trường.",
                wealth: "Chi tiêu điều độ, ưu tiên đầu tư cho sức khỏe và chất lượng sống.",
                love: "Gia đình là bến đỗ bình yên, nâng đỡ nhau qua mọi thăng trầm.",
                health: "Thể trạng dẻo dai như cây tùng cây bách, bệnh cũ thuyên giảm rõ rệt.",
                study: "Sức khỏe dồi dào giúp duy trì cường độ học tập ổn định suốt cả năm.",
                luckyNumber: "06 - 31 - 66",
                direction: "Xuất hành hướng Chính Đông hít thở sinh khí sớm mai."
            },
            {
                id: 32,
                category: ['health', 'love'],
                title: "QUẺ SỐ 32: THÂN TÂM AN LẠC",
                grade: "BÌNH AN CÁT TƯỜNG ★★★★☆",
                poem: "Buông bỏ ưu phiền nhẹ bước chân,\nNụ cười tỏa nắng ấm tình thân.\nTâm bình khí hòa muôn điều thiện,\nBốn mùa vui khỏe chẳng phân vân.",
                career: "Không tranh đua ồn ào mà vẫn hoàn thành công việc chỉn chu, đúng hẹn.",
                wealth: "Đủ đầy thanh thản, không vướng vào áp lực vay mượn hay rủi ro.",
                love: "Bao dung và nhẹ nhàng giúp gia đạo êm ấm suốt bốn mùa.",
                health: "Giấc ngủ sâu, tinh thần thư thái, hệ tiêu hóa và tim mạch ổn định.",
                study: "Học bằng niềm yêu thích tự nhiên thay vì áp lực, kết quả lại cao bất ngờ.",
                luckyNumber: "03 - 32 - 83",
                direction: "Xuất hành hướng Nam tìm về chốn thanh tịnh an vui."
            },
            {
                id: 33,
                category: ['health'],
                title: "QUẺ SỐ 33: KHANG NINH PHÚC THỌ",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Sớm tập thái cực đón bình minh,\nChiều dạo vườn xuân ngắm hoa xinh.\nĂn ngon ngủ yên lòng thanh thản,\nPhúc thọ khang ninh trọn nghĩa tình.",
                career: "Nhịp làm việc khoa học giúp hiệu suất cao mà không bị kiệt sức.",
                wealth: "Tài chính vững chãi, không phải lo toan chuyện phát sinh bất ngờ.",
                love: "Ông bà cha mẹ khỏe mạnh là niềm hạnh phúc lớn nhất của con cháu.",
                health: "Chỉ số sức khỏe ổn định, nên kiểm tra định kỳ đầu năm để yên tâm trọn vẹn.",
                study: "Thói quen sinh hoạt đúng giờ giúp đầu óc sảng khoái mỗi khi ngồi vào bàn học.",
                luckyNumber: "09 - 33 - 69",
                direction: "Xuất hành hướng Đông Nam đón nắng ấm buổi sớm."
            },
            {
                id: 34,
                category: ['health', 'all'],
                title: "QUẺ SỐ 34: XUÂN HÒA KHÍ THUẬN",
                grade: "TIỂU CÁT KHỞI SẮC ★★★★☆",
                poem: "Khí xuân ôn hòa thổi nhẹ qua,\nNắng ấm chan hòa khắp mái nhà.\nĐiều dưỡng tinh thần thêm tươi mới,\nLo âu tan biến hóa bình an.",
                career: "Mọi việc cứ tiến hành từ tốn, tránh nóng vội sẽ giữ được kết quả tốt.",
                wealth: "Tiền bạc tuy đến từ từ nhưng đều đặn và rất chắc tay.",
                love: "Một cuộc trò chuyện chân thành sẽ sưởi ấm lại tình cảm gia đình.",
                health: "Phục hồi thể lực rất nhanh, chú ý uống đủ nước và vận động nhẹ nhàng.",
                study: "Cần sắp xếp lịch nghỉ ngơi xen kẽ giữa các ca học để tránh quá tải.",
                luckyNumber: "05 - 34 - 54",
                direction: "Xuất hành hướng Chính Tây giúp tâm tính ôn hòa."
            },
            {
                id: 35,
                category: ['health'],
                title: "QUẺ SỐ 35: BÁCH BỆNH TIÊU TRỪ",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Nắng mới xua tan màn sương lạnh,\nSinh khí tràn về khắp cỏ cây.\nThuốc hay gặp thầy bệnh mau khỏi,\nKhỏe khoắn vui vầy tháng lại ngày.",
                career: "Năng lượng hồi phục mạnh mẽ giúp bạn bắt nhịp lại công việc đầy hứng khởi.",
                wealth: "Giảm bớt các khoản chi tiêu ngoài ý muốn, tiền giữ được trong tay.",
                love: "Nhận được sự chăm sóc ân cần chu đáo từ người thân yêu.",
                health: "Gặp thầy gặp thuốc, những mệt mỏi kéo dài năm cũ dần tan biến hẳn.",
                study: "Thể trạng khỏe mạnh trở lại giúp nhanh chóng bắt kịp tiến độ bài vở.",
                luckyNumber: "11 - 35 - 75",
                direction: "Xuất hành hướng Đông đón ánh dương cát lành."
            },
            {
                id: 36,
                category: ['love'],
                title: "QUẺ SỐ 36: NGUYỆT LÃO SE DUYÊN",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Sợi chỉ hồng thắm buộc cổ tay,\nNguyệt Lão se duyên đẹp tháng ngày.\nChẳng hẹn mà nên tình tri kỷ,\nMột lời ước hẹn trọn đời say.",
                career: "Mối quan hệ tốt đẹp mang lại nhiều cơ hội hợp tác thú vị.",
                wealth: "Cùng người thương hoạch định tài chính chung ngày càng vững vàng.",
                love: "Người độc thân dễ gặp định mệnh trong dịp đầu xuân; người đang yêu tính chuyện trăm năm.",
                health: "Niềm vui tình yêu làm tinh thần trẻ trung, yêu đời hơn hẳn.",
                study: "Cùng bạn đồng hành thi đua học tập, cả hai đều đạt thành tích đáng nể.",
                luckyNumber: "02 - 36 - 86",
                direction: "Xuất hành hướng Đông Bắc nghênh đón Hỷ Thần."
            },
            {
                id: 37,
                category: ['love'],
                title: "QUẺ SỐ 37: CẦM SẮT HÒA MINH",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Đàn cầm hòa nhịp với đàn tranh,\nĐôi lứa thương nhau nghĩa đậm lành.\nMột mái nhà êm đầy tiếng hát,\nBạc đầu răng long vẫn vẹn tình.",
                career: "Gia đình hòa thuận giúp bạn toàn tâm phát triển sự nghiệp lớn.",
                wealth: "Của chồng công vợ đồng lòng tích lũy, kinh tế ngày một khấm khá.",
                love: "Vợ chồng hòa hợp sâu sắc, biết nhường nhịn và trân trọng từng khoảnh khắc.",
                health: "Không khí gia đình ấm áp giúp mọi thành viên đều khỏe mạnh vui tươi.",
                study: "Không gian sống yên ấm tạo điều kiện lý tưởng cho việc đọc sách và nghiên cứu.",
                luckyNumber: "08 - 37 - 73",
                direction: "Xuất hành hướng Chính Nam giữ lửa hạnh phúc."
            },
            {
                id: 38,
                category: ['love', 'all'],
                title: "QUẺ SỐ 38: HỶ TƯỚC BÁO TIN",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Chim khách kêu vang trước ngõ xuân,\nTin vui phương xa sắp đến gần.\nBạn cũ tương phùng tay bắt mặt,\nNgàn lời chúc phúc rộn lòng dân.",
                career: "Nhận được thư mời hợp tác, phỏng vấn hoặc tin vui phê duyệt dự án.",
                wealth: "Có lộc nhỏ bất ngờ hoặc được hoàn tiền, tặng quà đầu năm.",
                love: "Đón tin vui sum họp, kết nối lại với người cũ hoặc bạn bè thân thiết.",
                health: "Tin vui tinh thần giúp cơ thể tràn ngập hứng khởi.",
                study: "Nhận kết quả thi hoặc thư báo nhập học tích cực hơn dự kiến.",
                luckyNumber: "12 - 38 - 68",
                direction: "Xuất hành hướng Đông Nam đón tin lành."
            },
            {
                id: 39,
                category: ['love'],
                title: "QUẺ SỐ 39: SONG HỶ LÂM MÔN",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Một nhà hai hỷ nối tiếp nhau,\nTrầu cau thắm đượm sắc xuân màu.\nCưới hỏi thêm con hay tậu nhà,\nNiềm vui nhân đôi rạng trước sau.",
                career: "Sự nghiệp và đời tư cùng lúc đón tin mừng rạng rỡ.",
                wealth: "Tài lộc đủ đầy để tổ chức những sự kiện trọng đại trong gia đình.",
                love: "Song hỷ lâm môn: tin vui tình duyên đi liền tin vui gia đạo, viên mãn hiếm có.",
                health: "Tinh thần phấn khởi, sức sống tràn đầy trong những ngày hỷ sự.",
                study: "Vừa có tin vui học tập vừa nhận được sự ủng hộ lớn từ người thân.",
                luckyNumber: "16 - 39 - 96",
                direction: "Xuất hành hướng Chính Đông nghênh đón song hỷ."
            },
            {
                id: 40,
                category: ['love', 'health'],
                title: "QUẺ SỐ 40: GIA HÒA VẠN SỰ HƯNG",
                grade: "BÌNH AN CÁT TƯỜNG ★★★★☆",
                poem: "Trong nhà hòa thuận ấm êm thay,\nNgoài ngõ gió xuân thổi mát bày.\nĐồng tâm một dạ vượt gian khó,\nHạnh phúc sum vầy trọn tháng ngày.",
                career: "Sự ủng hộ của gia đình là động lực giúp bạn bứt phá ở nơi làm việc.",
                wealth: "Chi tiêu gia đình hợp lý, có quỹ dự phòng an toàn vững chắc.",
                love: "Hóa giải hiểu lầm nhỏ bằng sự lắng nghe chân thành, tình thân thêm bền chặt.",
                health: "Bữa cơm gia đình ấm áp và lối sống điều độ giữ cho cả nhà luôn khỏe.",
                study: "Cha mẹ và con cái thấu hiểu nhau giúp việc định hướng học tập rất thuận lợi.",
                luckyNumber: "04 - 40 - 80",
                direction: "Xuất hành hướng Chính Tây giữ gìn hòa khí."
            },
            {
                id: 41,
                category: ['wealth'],
                title: "QUẺ SỐ 41: CHIÊU TÀI TIẾN BẢO",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Cửa hàng tấp nập khách ra vào,\nHàng hóa lưu thông lộc dâng cao.\nBuôn may bán đắt cười rạng rỡ,\nTài lộc đầy kho tiếng xôn xao.",
                career: "Kỹ năng bán hàng, đàm phán và chăm sóc khách hàng phát huy tối đa.",
                wealth: "Buôn bán đắt khách, dòng tiền quay vòng nhanh, lợi nhuận tăng đều hàng tháng.",
                love: "Công việc thuận lợi giúp tinh thần thoải mái, chiều chuộng người thương hơn.",
                health: "Chú ý giữ giọng nói và nghỉ ngơi hợp lý vào những ngày cao điểm.",
                study: "Thực hành kinh doanh, marketing hay quản lý tài chính thu được bài học quý.",
                luckyNumber: "18 - 41 - 88",
                direction: "Xuất hành hướng Chính Nam cầu tài đắc lợi."
            },
            {
                id: 42,
                category: ['wealth', 'career'],
                title: "QUẺ SỐ 42: LỘC MÃ GIAO TRÌ",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Đi xa mới thấy biển trời rộng,\nChuyển bước thay môi gặp lộc nồng.\nNăng động tìm đường mở lối mới,\nTài lộc theo chân chẳng mất công.",
                career: "Cơ hội mới đến từ việc đi xa, mở rộng thị trường hoặc chuyển sang môi trường năng động.",
                wealth: "Càng chịu khó di chuyển, kết nối thì lộc càng tự tìm đến.",
                love: "Những chuyến du xuân cùng nhau làm tình cảm thêm phần thú vị.",
                health: "Vận động ngoài trời nhiều giúp cơ thể săn chắc, dẻo dai.",
                study: "Du học, trao đổi sinh viên hoặc tham gia hội thảo xa mang lại bước ngoặt lớn.",
                luckyNumber: "07 - 42 - 72",
                direction: "Xuất hành hướng Tây Bắc mở rộng giao thương."
            },
            {
                id: 43,
                category: ['wealth'],
                title: "QUẺ SỐ 43: TÍCH CỐC PHÒNG CƠ",
                grade: "TIỂU CÁT KHỞI SẮC ★★★★☆",
                poem: "Được mùa chớ vội tiêu xài phí,\nTích trữ phòng khi gió bão về.\nQuản lý đồng tiền khéo léo lắm,\nCuối năm dư dả chẳng lo chi.",
                career: "Làm việc cẩn trọng, tính toán kỹ lưỡng giúp tránh được sai sót tốn kém.",
                wealth: "Tài chính tuy không bùng nổ một sớm một chiều nhưng tích lũy rất chắc chắn.",
                love: "Sự chín chắn và biết lo xa tạo cảm giác an toàn tuyệt đối cho nửa kia.",
                health: "Ăn uống thanh đạm, tiết chế tiệc tùng đầu năm rất có lợi cho cơ thể.",
                study: "Ôn tập có kế hoạch và quản lý thời gian chặt chẽ giúp đạt điểm ổn định.",
                luckyNumber: "05 - 43 - 65",
                direction: "Xuất hành hướng Chính Bắc giữ chặt tài khố."
            },
            {
                id: 44,
                category: ['wealth', 'all'],
                title: "QUẺ SỐ 44: KHAI TRƯƠNG ĐẠI PHÁT",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Pháo nổ vang trời đón sáng mai,\nKhai trương hồng phát lộc tràn đầy.\nKhách quý thập phương tìm đến cửa,\nUy tín vươn xa nối dài mãi.",
                career: "Khởi động dự án đầu năm đúng thời điểm vàng, tạo đà cho cả năm bùng nổ.",
                wealth: "Mở hàng suôn sẻ, hợp đồng đầu năm mang lại vận may liên hoàn.",
                love: "Bạn bè, người thân nhiệt tình chúc phúc và ủng hộ hết lòng.",
                health: "Khí thế hừng hực đầu xuân giúp vượt qua mọi mệt mỏi.",
                study: "Khai bút đầu xuân đúng giờ lành giúp cả năm học tập hanh thông.",
                luckyNumber: "08 - 44 - 88",
                direction: "Xuất hành hướng Đông Nam đón khách quý."
            },
            {
                id: 45,
                category: ['wealth'],
                title: "QUẺ SỐ 45: HÓA NGUY THÀNH AN",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Mây đen thoáng chốc rồi tan hết,\nÁnh nắng bừng lên rọi khắp nơi.\nKhoản khó tưởng chừng không gỡ nổi,\nNay gặp người hiền giúp sáng ngời.",
                career: "Những vướng mắc tồn đọng từ năm cũ dần được tháo gỡ êm thấm.",
                wealth: "Thu hồi được công nợ hoặc thoát khỏi một khoản rủi ro đúng lúc.",
                love: "Sau cơn mưa trời lại sáng, đôi bên càng thêm trân trọng nhau.",
                health: "Vượt qua giai đoạn mệt mỏi, thể trạng hồi phục nhanh chóng.",
                study: "Môn học từng yếu nhất nay tìm được cách tiếp cận đúng và cải thiện rõ rệt.",
                luckyNumber: "10 - 45 - 95",
                direction: "Xuất hành hướng Chính Đông hóa giải trắc trở."
            },
            {
                id: 46,
                category: ['career'],
                title: "QUẺ SỐ 46: ĐẠI BÀNG TRIỂN DỰC",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Chim bằng sải cánh giữa trời cao,\nBốn bể tung hoành chí khí hào.\nChẳng ngại gió sương đường vạn dặm,\nĐỉnh cao danh vọng ắt chạm vào.",
                career: "Tầm nhìn chiến lược sắc bén đưa bạn lên vị trí dẫn dắt hoặc quản lý cấp cao.",
                wealth: "Thu nhập xứng tầm vị thế, thưởng hiệu suất vượt xa kỳ vọng.",
                love: "Người đồng hành tự hào và luôn sát cánh ủng hộ hoài bão của bạn.",
                health: "Sức bền và bản lĩnh vững vàng trước áp lực lớn.",
                study: "Đặt mục tiêu lớn như học bổng quốc tế hoặc giải thưởng cấp quốc gia rất khả thi.",
                luckyNumber: "09 - 46 - 99",
                direction: "Xuất hành hướng Tây Bắc mở rộng tầm vóc."
            },
            {
                id: 47,
                category: ['career'],
                title: "QUẺ SỐ 47: THĂNG TIẾN PHÙNG THỜI",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Nấc thang sự nghiệp bước lên cao,\nCấp trên tin cậy bạn đồng hào.\nBao năm tận tụy không lời oán,\nNay hưởng hoa thơm trái ngọt ngào.",
                career: "Thời điểm chín muồi để đề xuất tăng lương, thăng chức hoặc nhận dự án chủ chốt.",
                wealth: "Lương thưởng tăng đều, tài chính gia đình ngày càng dư dả.",
                love: "Biết chia sẻ thời gian hợp lý nên tình cảm vẫn ấm nồng.",
                health: "Chú ý tư thế ngồi làm việc và giãn cơ nhẹ giữa giờ.",
                study: "Chứng chỉ chuyên ngành mới sẽ là bàn đạp trực tiếp cho bước thăng tiến.",
                luckyNumber: "14 - 47 - 74",
                direction: "Xuất hành hướng Chính Đông gặp quý nhân đề bạt."
            },
            {
                id: 48,
                category: ['career', 'study'],
                title: "QUẺ SỐ 48: HẬU TÍCH BẠC PHÁT",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Mười năm mài sắt có ngày nên,\nChậm rãi mà sâu nền tảng bền.\nĐừng thấy người nhanh mà sốt ruột,\nĐến kỳ hoa nở ắt vang tên.",
                career: "Nửa đầu năm âm thầm chuẩn bị, nửa cuối năm bùng nổ kết quả khiến ai cũng nể.",
                wealth: "Chưa cần mạo hiểm sớm; giữ vốn chắc chờ cơ hội rõ ràng ở quý III sẽ thắng lớn.",
                love: "Tình cảm chín muồi tự nhiên theo thời gian, không gượng ép.",
                health: "Duy trì nhịp sống điều độ giúp tích lũy năng lượng bền bỉ.",
                study: "Chăm chút từng chuyên đề nhỏ, đến kỳ thi tổng hợp sẽ phát huy sức mạnh vượt trội.",
                luckyNumber: "06 - 48 - 68",
                direction: "Xuất hành hướng Chính Bắc giữ vững định lực."
            },
            {
                id: 49,
                category: ['career'],
                title: "QUẺ SỐ 49: ĐỒNG TÂM HIỆP LỰC",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Một cây làm chẳng nên non cao,\nBa cây chụm lại vút tầng sao.\nTìm được đồng đội cùng chí hướng,\nViệc lớn thành công chẳng chút hao.",
                career: "Làm việc nhóm ăn ý, tìm được cộng sự bù trừ hoàn hảo cho điểm mạnh của bạn.",
                wealth: "Hợp tác làm ăn chia sẻ lợi ích minh bạch giúp đôi bên cùng giàu.",
                love: "Sự sẻ chia trách nhiệm giúp gia đình luôn nhẹ nhàng vui vẻ.",
                health: "Tham gia thể thao đồng đội vừa khỏe người vừa thêm bạn tốt.",
                study: "Học nhóm và trao đổi tài liệu cùng bạn bè giúp tiến bộ nhanh gấp bội.",
                luckyNumber: "03 - 49 - 79",
                direction: "Xuất hành hướng Đông Nam gặp cộng sự tâm đầu."
            },
            {
                id: 50,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 50: KIM BẢNG ĐỀ DANH",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Tên vàng khắc đá sáng muôn đời,\nUy tín vang xa khắp mọi nơi.\nGiữ trọn chữ tín làm gốc rễ,\nCông danh phú quý chẳng hề vơi.",
                career: "Xây dựng danh tiếng cá nhân vững chắc, được giới chuyên môn công nhận.",
                wealth: "Thương hiệu cá nhân mang lại nhiều hợp đồng tư vấn và thu nhập cao.",
                love: "Gia đình tự hào về những cống hiến nghiêm túc của bạn.",
                health: "Ngủ đủ giấc và giữ tinh thần tích cực giúp sắc diện luôn rạng ngời.",
                study: "Đạt danh hiệu xuất sắc hoặc được vinh danh trong các cuộc thi học thuật.",
                luckyNumber: "15 - 50 - 90",
                direction: "Xuất hành hướng Chính Nam đón vinh quang."
            },
            {
                id: 51,
                category: ['all'],
                title: "QUẺ SỐ 51: XUÂN QUANG VẠN LÝ",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Ánh xuân trải rộng khắp muôn phương,\nMở mắt nhìn ra thấy cát tường.\nĐường dài phía trước đầy hoa thắm,\nVững bước tự tin ngát dặm trường.",
                career: "Nhiều hướng đi mới mở ra, hãy chọn con đường khiến bạn hứng khởi nhất.",
                wealth: "Thu nhập ổn định, có thêm khoản thưởng từ những nỗ lực ngoài dự kiến.",
                love: "Tâm trạng cởi mở giúp bạn dễ kết nối với những người chân thành.",
                health: "Du xuân, dã ngoại đầu năm giúp tái tạo năng lượng tuyệt vời.",
                study: "Mở rộng đọc thêm sách ngoài giáo trình giúp tầm nhìn sâu rộng hơn.",
                luckyNumber: "11 - 51 - 81",
                direction: "Xuất hành hướng Chính Đông đón nắng xuân."
            },
            {
                id: 52,
                category: ['wealth', 'love'],
                title: "QUẺ SỐ 52: NGỌC THỎ NGHÊNH XUÂN",
                grade: "TIỂU CÁT KHỞI SẮC ★★★★☆",
                poem: "Nhẹ nhàng khéo léo tựa ánh trăng,\nLấy nhu thắng cương việc khó bằng.\nỨng xử dịu dàng thêm phần phúc,\nNgười thương kẻ mến lộc tự tăng.",
                career: "Sự khéo léo trong giao tiếp giúp hóa giải xung đột và chốt việc êm đẹp.",
                wealth: "Nhờ thái độ hòa nhã mà khách hàng cũ giới thiệu thêm nhiều khách mới.",
                love: "Lời nói dịu dàng đầu năm mang lại bầu không khí ngọt ngào suốt cả tháng.",
                health: "Tránh nóng giận để bảo vệ tim mạch và giữ tinh thần an nhiên.",
                study: "Kiên nhẫn đọc kỹ đề bài, làm bài cẩn thận từng bước sẽ tránh mất điểm oan.",
                luckyNumber: "02 - 52 - 72",
                direction: "Xuất hành hướng Chính Tây giữ tâm nhu hòa."
            },
            {
                id: 53,
                category: ['career', 'all'],
                title: "QUẺ SỐ 53: TÙNG HẠC DIÊN NIÊN",
                grade: "BÌNH AN CÁT TƯỜNG ★★★★☆",
                poem: "Hạc trắng bay về đậu đỉnh tùng,\nThanh cao khí tiết giữ thủy chung.\nChẳng màng danh lợi phù hoa hão,\nMà phúc lộc vẫn tự tìm cùng.",
                career: "Làm việc ngay thẳng, giữ chuẩn mực nghề nghiệp sẽ được trọng dụng lâu dài.",
                wealth: "Tiền bạc sạch sẽ, minh bạch nên giữ được bền vững qua nhiều năm.",
                love: "Gia phong thanh bạch, con cháu hiếu thảo kính trên nhường dưới.",
                health: "Thân tâm thanh tịnh, ít vướng bận lo âu nên sức khỏe rất tốt.",
                study: "Học thực chất, không chạy theo hình thức sẽ tạo nên nội lực vững vàng.",
                luckyNumber: "09 - 53 - 89",
                direction: "Xuất hành hướng Chính Bắc đón khí thanh cao."
            },
            {
                id: 54,
                category: ['wealth'],
                title: "QUẺ SỐ 54: PHONG NIÊN ĐẠI HỮU",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Đồng xanh lúa chín trĩu bông vàng,\nKho lẫm đầy ắp đón xuân sang.\nMột năm mưa thuận gió hòa lắm,\nNo ấm bình an khắp bản làng.",
                career: "Mùa thu hoạch lớn sau thời gian dài gieo hạt chăm chỉ.",
                wealth: "Thu nhập bội thu, tiền bạc dư dả để nâng cấp chất lượng sống cho cả nhà.",
                love: "Cuộc sống đủ đầy giúp gia đình thêm gắn kết, tổ chức nhiều chuyến đi vui.",
                health: "Sức khỏe tốt, ăn ngon miệng, tinh thần sảng khoái.",
                study: "Kiến thức tích lũy bấy lâu nay phát huy tác dụng rực rỡ trong kỳ thi lớn.",
                luckyNumber: "16 - 54 - 84",
                direction: "Xuất hành hướng Tây Nam đón mùa bội thu."
            },
            {
                id: 55,
                category: ['study', 'health'],
                title: "QUẺ SỐ 55: THANH VÂN ĐẮC LỘ",
                grade: "TRUNG CÁT ★★★★☆",
                poem: "Đường mây xanh thẳm mở chân trời,\nBước nhẹ thênh thang chẳng ngại ngần.\nTrí sáng lòng trong tay vững lái,\nVươn mình tỏa sáng giữa xuân tươi.",
                career: "Lộ trình phát triển rõ ràng, không còn cảm giác mông lung như trước.",
                wealth: "Tài chính ổn định, đủ sức đầu tư cho các mục tiêu học tập và nâng cấp bản thân.",
                love: "Giữ sự cân bằng giữa không gian riêng và thời gian cho người thương.",
                health: "Tập hít thở sâu và giãn cơ mỗi sáng giúp tinh thần minh mẫn cả ngày.",
                study: "Xác định đúng chuyên ngành và phương pháp, việc học trở nên nhẹ nhàng thú vị.",
                luckyNumber: "07 - 55 - 77",
                direction: "Xuất hành hướng Đông Bắc mở lối thanh vân."
            },
            {
                id: 56,
                category: ['love', 'all'],
                title: "QUẺ SỐ 56: HÒA KHÍ SINH TÀI",
                grade: "TIỂU CÁT KHỞI SẮC ★★★★☆",
                poem: "Mở miệng cười tươi đón khách hiền,\nHòa khí sinh tài lộc tự nhiên.\nBỏ qua chấp nhặt điều nho nhỏ,\nPhúc lớn theo sau chẳng tốn tiền.",
                career: "Mối quan hệ đồng nghiệp hài hòa giúp công việc trôi chảy bất ngờ.",
                wealth: "Giữ hòa khí trong hợp tác mang lại những mối làm ăn lâu dài.",
                love: "Một câu nhường nhịn giữ trọn niềm vui cả ngày, gia đạo êm ấm.",
                health: "Tâm trạng vui vẻ giúp hệ miễn dịch hoạt động hiệu quả hơn.",
                study: "Thái độ cầu thị, vui vẻ giúp bạn được thầy cô và bạn bè yêu quý hỗ trợ.",
                luckyNumber: "04 - 56 - 68",
                direction: "Xuất hành hướng Đông Nam đón hòa khí."
            },
            {
                id: 57,
                category: ['career'],
                title: "QUẺ SỐ 57: TIỀN TRÌNH CẨM TÚ",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Phía trước đường hoa trải gấm thêu,\nÁnh dương rực rỡ chiếu muôn chiều.\nTự tin tiến bước đừng e ngại,\nThành quả huy hoàng đẹp biết bao.",
                career: "Tương lai nghề nghiệp rộng mở, có cơ hội chuyển sang vị trí mơ ước.",
                wealth: "Thu nhập tăng trưởng theo cấp số cộng nhờ năng lực được công nhận.",
                love: "Cùng người thương vẽ nên kế hoạch tương lai đầy cảm hứng.",
                health: "Thể lực ổn định, giữ thói quen ngủ nghỉ khoa học.",
                study: "Định hướng nghề nghiệp gắn với đam mê giúp học tập tiến bộ vượt bậc.",
                luckyNumber: "13 - 57 - 97",
                direction: "Xuất hành hướng Chính Nam đón tương lai rực rỡ."
            },
            {
                id: 58,
                category: ['health', 'career'],
                title: "QUẺ SỐ 58: AN CƯ LẠC NGHIỆP",
                grade: "BÌNH AN CÁT TƯỜNG ★★★★☆",
                poem: "Nhà ấm êm rồi dạ mới an,\nChuyên tâm lập nghiệp chẳng thở than.\nGốc rễ vững vàng cây xanh tốt,\nBốn mùa hoa nở rạng nhân gian.",
                career: "Ổn định chỗ đứng vững chắc trước khi nghĩ tới mở rộng quy mô lớn hơn.",
                wealth: "Tài chính hướng tới sự an toàn, có thể có tin vui về nhà cửa đất đai.",
                love: "Tổ ấm yên bình là chỗ dựa tinh thần tuyệt vời nhất.",
                health: "Không gian sống gọn gàng, thoáng đãng giúp tinh thần và sức khỏe cải thiện rõ.",
                study: "Góc học tập ngăn nắp, yên tĩnh giúp hiệu suất ôn tập tăng cao.",
                luckyNumber: "06 - 58 - 86",
                direction: "Xuất hành hướng Tây Bắc cầu an cư vững bền."
            },
            {
                id: 59,
                category: ['study', 'love'],
                title: "QUẺ SỐ 59: LƯƠNG SƯ ÍCH HỮU",
                grade: "TIỂU CÁT KHỞI SẮC ★★★★☆",
                poem: "Một chữ làm thầy nửa chữ thầy,\nBạn hiền tri kỷ ở quanh đây.\nChân thành kết nối tình sâu nặng,\nĐường đời thêm ấm mỗi tháng ngày.",
                career: "Gặp được người dẫn đường (mentor) tâm huyết giúp rút ngắn nhiều năm thử sai.",
                wealth: "Lời khuyên đúng lúc từ người có kinh nghiệm giúp tránh thất thoát tiền bạc.",
                love: "Kết giao được những người bạn chân tình, đáng tin cậy suốt đời.",
                health: "Sinh hoạt cùng nhóm bạn tích cực giúp duy trì thói quen rèn luyện đều đặn.",
                study: "Gặp thầy giỏi chỉ đúng trọng tâm, khai thông những nút thắt học tập lâu nay.",
                luckyNumber: "01 - 59 - 91",
                direction: "Xuất hành hướng Chính Đông gặp bậc hiền nhân."
            },
            {
                id: 60,
                category: ['all'],
                title: "QUẺ SỐ 60: VIÊN MÃN ĐẠI CÁT",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Sáu mươi hoa giáp trọn một vòng,\nĐinh Mùi rực rỡ thỏa hoài mong.\nPhúc - Lộc - Thọ - Khang đều hội tụ,\nVạn sự cát tường ấm cõi lòng.",
                career: "Mọi mảnh ghép sự nghiệp khớp vào nhau hoàn hảo, gặt hái thành tựu trọn vẹn.",
                wealth: "Tài lộc hanh thông từ đầu năm đến cuối năm, dư dả vững bền.",
                love: "Gia đạo sum vầy, nhân duyên viên mãn, trong ngoài đều thuận hòa.",
                health: "Thân khỏe tâm an, tràn đầy phúc khí và năng lượng tích cực.",
                study: "Học vấn tinh thông, thi cử đỗ đạt, mọi dự định tri thức đều viên mãn.",
                luckyNumber: "60 - 68 - 86",
                direction: "Xuất hành hướng Đông Nam nghênh đón vạn phúc viên mãn."
            }
        ];

        // Cấu hình chi tiết cho từng ý nguyện cầu an
        this.intentConfigs = {
            all: {
                id: 'all',
                name: 'Toàn Duyên Vận Mệnh',
                icon: '🌟',
                kanji: '福',
                ribbon: 'VẠN SỰ CÁT TƯỜNG',
                btnText: 'Lắc Ống Xăm Khai Vận',
                desc: 'Tổng hòa trọn vẹn Công danh, Tài lộc, Gia đạo, Sức khỏe và Khoa cử cho năm Đinh Mùi 2027.',
                advice: '💡 <strong>Lời Khuyên Khai Vận Toàn Năng 2027:</strong> Mùng 1 Tết xuất hành hướng Đông Nam đón Hỷ Thần. Khai bút đầu xuân lúc 8h–10h sáng. Giữ tâm an hòa, năng làm việc thiện ắt vạn sự đại cát!'
            },
            career: {
                id: 'career',
                name: 'Công Danh & Sự Nghiệp',
                icon: '💼',
                kanji: '祿',
                ribbon: 'CÔNG DANH THĂNG TIẾN',
                btnText: 'Lắc Ống Xăm Cầu Công Danh',
                desc: 'Ưu tiên các quẻ chuyên sâu về thăng quan tiến chức, gặp quý nhân trợ lực và bứt phá sự nghiệp.',
                advice: '💡 <strong>Lời Khuyên Khai Vận Công Danh 2027:</strong> Bố trí bàn làm việc hướng Chính Đông hoặc Đông Bắc để kích hoạt sao Văn Xương & Quan Lộc. Ngày Mùng 6 âm lịch khai xuân mở máy đón vận thăng tiến!'
            },
            wealth: {
                id: 'wealth',
                name: 'Tài Lộc & Kinh Doanh',
                icon: '💰',
                kanji: '財',
                ribbon: 'TÀI LỘC ĐẠI PHÁT',
                btnText: 'Lắc Ống Xăm Cầu Tài Lộc',
                desc: 'Ưu tiên các quẻ chuyên sâu về dòng tiền sinh sôi, buôn may bán đắt, đầu tư thắng lợi và thỉnh Thần Tài.',
                advice: '💡 <strong>Lời Khuyên Khai Vận Tài Lộc 2027:</strong> Đêm giao thừa thỉnh Thần Tài từ hướng Chính Nam. Ngày Mùng 8 âm lịch mở hàng buôn bán. Chuẩn bị bao lì xì mệnh giá may mắn (68k, 88k) để giữ vía tài lộc cả năm!'
            },
            love: {
                id: 'love',
                name: 'Tình Duyên & Gia Đạo',
                icon: '❤️',
                kanji: '緣',
                ribbon: 'NHÂN DUYÊN HỶ SỰ',
                btnText: 'Lắc Ống Xăm Cầu Tình Duyên',
                desc: 'Ưu tiên các quẻ chuyên sâu về Nguyệt Lão se duyên, tình cảm thăng hoa, trăm năm kết tóc và gia đạo thuận hòa.',
                advice: '💡 <strong>Lời Khuyên Khai Vận Tình Duyên 2027:</strong> Mùng 1 Tết xuất hành hướng Đông Bắc nghênh đón Hỷ Thần. Đầu năm viếng chùa dâng hương cầu duyên lành. Trong nhà cắm hoa đào hoa mai nở rộ để chiêu dẫn đào hoa cát tinh!'
            },
            health: {
                id: 'health',
                name: 'Sức Khỏe & Bình An',
                icon: '🩺',
                kanji: '壽',
                ribbon: 'BÌNH AN TRƯỜNG THỌ',
                btnText: 'Lắc Ống Xăm Cầu Sức Khỏe',
                desc: 'Ưu tiên các quẻ chuyên sâu về Phúc Thọ khang kiện, thân tâm an lạc, tiêu trừ tai ách và tinh thần minh mẫn.',
                advice: '💡 <strong>Lời Khuyên Khai Vận Sức Khỏe 2027:</strong> Sáng Mùng 1 thức sớm hít thở khí dương quang buổi sớm. Đầu xuân lễ chùa phóng sinh tích đức. Duy trì lối sống điều độ, tâm tịnh khí hòa thì bách bệnh tiêu tan!'
            },
            study: {
                id: 'study',
                name: 'Khoa Cử & Học Vấn',
                icon: '🎓',
                kanji: '魁',
                ribbon: 'KHOA CỬ THỦ KHOA',
                btnText: 'Lắc Ống Xăm Cầu Khoa Cử',
                desc: 'Ưu tiên các quẻ chuyên sâu về Văn Xương trợ vận, thi cử đỗ đạt cao, xin học bổng thành công và bảng vàng đề tên.',
                advice: '💡 <strong>Lời Khuyên Khai Vận Khoa Cử 2027:</strong> Khai bút đầu xuân vào giờ Thìn mùng 3 Tết. Xin chữ "Đạt" hoặc "Trí" của ông đồ treo ở bàn học hướng Đông Bắc để khai thông trí tuệ, tự tin vượt qua mọi kỳ thi!'
            }
        };

        this.categoryFocusMap = {
            career: {
                title: '💼 TRỌNG TÂM CẦU CÔNG DANH & SỰ NGHIỆP',
                key: 'career',
                subKeys: ['wealth', 'study', 'love', 'health']
            },
            wealth: {
                title: '💰 TRỌNG TÂM CẦU TÀI LỘC & KINH DOANH',
                key: 'wealth',
                subKeys: ['career', 'love', 'health', 'study']
            },
            love: {
                title: '❤️ TRỌNG TÂM CẦU TÌNH DUYÊN & GIA ĐẠO',
                key: 'love',
                subKeys: ['career', 'wealth', 'health', 'study']
            },
            health: {
                title: '🩺 TRỌNG TÂM CẦU SỨC KHỎE & BÌNH AN',
                key: 'health',
                subKeys: ['career', 'wealth', 'love', 'study']
            },
            study: {
                title: '🎓 TRỌNG TÂM CẦU KHOA CỬ & HỌC VẤN',
                key: 'study',
                subKeys: ['career', 'wealth', 'love', 'health']
            },
            all: {
                title: '🌟 VẬN TRÌNH TOÀN DUYÊN ĐẠI CÁT 2027',
                key: null,
                subKeys: ['career', 'wealth', 'love', 'health']
            }
        };

        this.isShaking = false;
        this.bindEvents();
        this.updateIntentUI('all');
    }

    loadHistory() {
        try {
            const raw = sessionStorage.getItem(this.historyStorageKey);
            const parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch {
            return {};
        }
    }

    saveHistory() {
        try {
            sessionStorage.setItem(this.historyStorageKey, JSON.stringify(this.drawnHistory));
        } catch {
            // Bỏ qua nếu trình duyệt chặn sessionStorage
        }
    }

    showToast(message, duration = 2500) {
        const toast = document.getElementById('tet-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    }

    getPoolForCategory(category) {
        if (!category || category === 'all') {
            return this.fortunes;
        }
        const matched = this.fortunes.filter(f => Array.isArray(f.category) && f.category.includes(category));
        return matched.length > 0 ? matched : this.fortunes;
    }

    drawNextFortune(category) {
        const catKey = category || 'all';
        const pool = this.getPoolForCategory(catKey);
        const usedIds = Array.isArray(this.drawnHistory[catKey]) ? this.drawnHistory[catKey] : [];
        let remaining = pool.filter(f => !usedIds.includes(f.id));

        if (remaining.length === 0) {
            // Đã rút hết vòng quẻ của ý nguyện này -> reset vòng mới, tránh trùng ngay quẻ vừa rút
            const lastId = this.lastDrawnByCategory[catKey];
            this.drawnHistory[catKey] = [];
            remaining = pool.length > 1 && lastId != null
                ? pool.filter(f => f.id !== lastId)
                : pool;
        }

        const picked = remaining[Math.floor(Math.random() * remaining.length)];
        this.drawnHistory[catKey] = [...(this.drawnHistory[catKey] || []), picked.id];
        this.lastDrawnByCategory[catKey] = picked.id;
        this.saveHistory();
        return picked;
    }

    updateIntentUI(category) {
        const config = this.intentConfigs[category] || this.intentConfigs['all'];

        const iconEl = document.getElementById('intent-badge-icon');
        const titleEl = document.getElementById('intent-title');
        const descEl = document.getElementById('intent-desc');
        const shakeBtn = document.getElementById('btn-shake-fortune');
        const kanjiEl = document.getElementById('cup-seal-kanji');
        const ribbonEl = document.getElementById('cup-seal-ribbon');
        const medallion = document.getElementById('cup-seal-medallion');

        if (iconEl) iconEl.textContent = config.icon;
        if (titleEl) titleEl.textContent = config.name;
        if (descEl) descEl.textContent = config.desc;
        if (shakeBtn) {
            shakeBtn.replaceChildren();
            const iconSpan = document.createElement('span');
            iconSpan.textContent = config.icon;
            shakeBtn.appendChild(iconSpan);
            shakeBtn.appendChild(document.createTextNode(` ${config.btnText}`));
        }

        if (kanjiEl) kanjiEl.textContent = config.kanji;
        if (ribbonEl) ribbonEl.textContent = config.ribbon;

        if (medallion) {
            medallion.style.transition = 'transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            medallion.style.transform = 'scale(1.15) rotate(10deg)';
            setTimeout(() => {
                medallion.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
    }

    bindEvents() {
        const shakeBtn = document.getElementById('btn-shake-fortune');
        const cupEl = document.getElementById('fortune-cup-element');
        const modal = document.getElementById('fortune-modal');
        const closeModal = document.getElementById('btn-close-fortune');
        const reShakeBtn = document.getElementById('btn-reshake');
        const copyBtn = document.getElementById('btn-copy-fortune');
        const filterBtns = document.querySelectorAll('.fortune-filter-btn');

        if (shakeBtn) {
            shakeBtn.addEventListener('click', () => this.shake());
        }

        if (cupEl) {
            cupEl.addEventListener('click', () => this.shake());
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCategory = btn.getAttribute('data-category') || 'all';

                this.updateIntentUI(this.selectedCategory);

                if (window.tetAudio) {
                    window.tetAudio.init();
                    window.tetAudio.playLuckyChime();
                }

                const label = btn.textContent.trim();
                this.showToast(`🎋 Đã chọn ý nguyện: ${label}. Hãy lắc ống xăm để nhận quẻ ứng nghiệm!`, 2500);
            });
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                if (modal) modal.classList.add('hidden');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }

        if (reShakeBtn) {
            reShakeBtn.addEventListener('click', () => {
                if (modal) modal.classList.add('hidden');
                setTimeout(() => this.shake(), 300);
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyFortuneText());
        }
    }

    shake() {
        if (this.isShaking) return;
        this.isShaking = true;

        const cupEl = document.getElementById('fortune-cup-element');
        const shakeBtn = document.getElementById('btn-shake-fortune');
        const config = this.intentConfigs[this.selectedCategory] || this.intentConfigs['all'];

        if (window.tetAudio) {
            window.tetAudio.init();
            if (typeof window.tetAudio.playBambooShake === 'function') {
                window.tetAudio.playBambooShake();
            }
        }

        if (cupEl) cupEl.classList.add('shaking');
        if (shakeBtn) {
            shakeBtn.disabled = true;
            shakeBtn.innerHTML = `<span class="spin-icon">🎋</span> Đang Thành Tâm Xóc Quẻ ${config.name}...`;
        }

        if (window.fireworks && cupEl) {
            const rect = cupEl.getBoundingClientRect();
            window.fireworks.explodeAt(rect.left + rect.width / 2, rect.top + 20);
            setTimeout(() => {
                window.fireworks.explodeAt(rect.left + rect.width / 2 - 40, rect.top);
                window.fireworks.explodeAt(rect.left + rect.width / 2 + 40, rect.top);
            }, 600);
        }

        setTimeout(() => {
            if (cupEl) cupEl.classList.remove('shaking');
            if (shakeBtn) {
                shakeBtn.disabled = false;
                this.updateIntentUI(this.selectedCategory);
            }
            this.isShaking = false;
            this.showFortuneByCategory();
        }, 1800);
    }

    showFortuneByCategory() {
        const config = this.intentConfigs[this.selectedCategory] || this.intentConfigs['all'];
        const item = this.drawNextFortune(this.selectedCategory);

        const titleEl = document.getElementById('fortune-res-title');
        const numPillEl = document.getElementById('fortune-res-num-pill');
        const nameTextEl = document.getElementById('fortune-res-name-text');
        const gradeEl = document.getElementById('fortune-res-grade');
        const poemEl = document.getElementById('fortune-res-poem');
        const numberEl = document.getElementById('fortune-res-number');
        const directionEl = document.getElementById('fortune-res-direction');
        const intentBadgeEl = document.getElementById('fortune-modal-intent-badge');
        const focusTitle = document.getElementById('fortune-focus-title');
        const focusDesc = document.getElementById('fortune-focus-desc');
        const adviceBox = document.getElementById('fortune-res-advice-box');

        const titleParts = item.title.split(':');
        if (numPillEl && nameTextEl && titleParts.length > 1) {
            numPillEl.textContent = titleParts[0].trim();
            nameTextEl.textContent = titleParts.slice(1).join(':').trim();
        } else if (titleEl) {
            titleEl.textContent = item.title;
        }

        if (gradeEl) gradeEl.textContent = item.grade;
        if (poemEl) poemEl.textContent = item.poem;
        if (numberEl) numberEl.textContent = item.luckyNumber;
        if (directionEl) directionEl.textContent = item.direction;

        if (intentBadgeEl) {
            intentBadgeEl.textContent = `${config.icon} Ý Nguyện: ${config.name}`;
        }

        const domains = {
            career: { label: '💼 Công Danh', text: item.career },
            wealth: { label: '💰 Tài Lộc', text: item.wealth },
            love: { label: '❤️ Tình Duyên', text: item.love },
            health: { label: '🩺 Sức Khỏe', text: item.health },
            study: { label: '🎓 Khoa Cử', text: item.study }
        };

        const focusConfig = this.categoryFocusMap[this.selectedCategory] || this.categoryFocusMap.all;
        if (focusTitle) focusTitle.textContent = focusConfig.title;

        const focusText = focusConfig.key
            ? item[focusConfig.key]
            : `${item.career} ${item.wealth}`;
        if (focusDesc) focusDesc.textContent = focusText;

        focusConfig.subKeys.slice(0, 4).forEach((key, idx) => {
            const num = idx + 1;
            const labelEl = document.getElementById(`sub-card-label-${num}`);
            const descEl = document.getElementById(`sub-card-desc-${num}`);
            if (labelEl) labelEl.textContent = domains[key].label;
            if (descEl) descEl.textContent = domains[key].text;
        });

        if (adviceBox) {
            adviceBox.innerHTML = config.advice;
        }

        const modal = document.getElementById('fortune-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }

        if (window.fireworks) {
            window.fireworks.explodeAt(window.innerWidth / 2, window.innerHeight * 0.3);
        }

        if (window.tetAudio && typeof window.tetAudio.playLuckyChime === 'function') {
            window.tetAudio.playLuckyChime();
        }
    }

    copyFortuneText() {
        const config = this.intentConfigs[this.selectedCategory] || this.intentConfigs['all'];
        const numPill = document.getElementById('fortune-res-num-pill')?.textContent;
        const nameText = document.getElementById('fortune-res-name-text')?.textContent;
        const title = numPill && nameText ? `${numPill}: ${nameText}` : (document.getElementById('fortune-res-title')?.textContent || '');
        const grade = document.getElementById('fortune-res-grade')?.textContent || '';
        const poem = document.getElementById('fortune-res-poem')?.textContent || '';
        const focusTitle = document.getElementById('fortune-focus-title')?.textContent || '';
        const focusDesc = document.getElementById('fortune-focus-desc')?.textContent || '';
        const number = document.getElementById('fortune-res-number')?.textContent || '';
        const direction = document.getElementById('fortune-res-direction')?.textContent || '';
        const advice = document.getElementById('fortune-res-advice-box')?.innerText || '';

        const sub1 = document.getElementById('sub-card-label-1')?.textContent + ' ' + document.getElementById('sub-card-desc-1')?.textContent;
        const sub2 = document.getElementById('sub-card-label-2')?.textContent + ' ' + document.getElementById('sub-card-desc-2')?.textContent;
        const sub3 = document.getElementById('sub-card-label-3')?.textContent + ' ' + document.getElementById('sub-card-desc-3')?.textContent;
        const sub4 = document.getElementById('sub-card-label-4')?.textContent + ' ' + document.getElementById('sub-card-desc-4')?.textContent;

        const text = `🎋 [SỚ QUẺ XĂM TẾT ĐINH MÙI 2027] 🎋\n${title}\nCấp bậc: ${grade}\n🎯 Ý nguyện: ${config.name}\n\n📜 THƠ KHAI VẬN:\n${poem}\n\n⭐ ${focusTitle}:\n${focusDesc}\n\n${sub1}\n${sub2}\n${sub3}\n${sub4}\n\n🔢 Số may mắn: ${number}\n🧭 Hướng xuất hành: ${direction}\n\n${advice}\n\nCung chúc tân xuân 2027 vạn sự như ý!`;

        navigator.clipboard.writeText(text).then(() => {
            this.showToast('📋 Đã sao chép nội dung quẻ xăm vào bộ nhớ tạm! Bạn có thể chia sẻ cho người thân!', 3000);
        }).catch(() => {
            this.showToast('⚠️ Trình duyệt không cho phép sao chép tự động, vui lòng bôi đen để chép.', 3000);
        });
    }
}

window.FortuneSystem = FortuneSystem;
