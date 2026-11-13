/**
 * Fortune Drawing System (Rút Quẻ Đầu Năm Đinh Mùi 2027)
 * Đa dạng 24 Quẻ Cát Tường authentic, hỗ trợ phân loại ý nguyện (Toàn duyên, Công danh, Tài lộc, Tình duyên, Sức khỏe, Khoa cử)
 */
class FortuneSystem {
    constructor() {
        this.selectedCategory = 'all';

        this.fortunes = [
            {
                id: 1,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 01: KIM DƯƠNG KHAI THÁI",
                grade: "THƯỢNG THƯỢNG CÁT ★★★★★",
                poem: "Dê vàng nghênh đón nắng mai sang,\nPhúc thọ tràn trề lộc chứa chan.\nMở lối công danh bừng phú quý,\nMuôn phương tụ hội vạn niềm hoan.",
                career: "Công việc có quý nhân tương trợ, mở rộng quy mô, ký kết hợp đồng lớn hoặc thăng chức bất ngờ.",
                wealth: "Tài lộc cuồn cuộn đổ về như nước sông Hồng, tiền vào túi nhiều hơn tiền ra gấp bội.",
                love: "Gia đạo êm ấm, người độc thân gặp được ý trung nhân tâm đầu ý hợp, trăm năm hòa hợp.",
                health: "Khí huyết dồi dào, thân tâm an lạc, tràn đầy năng lượng tươi mới mỗi ngày.",
                luckyNumber: "27 - 68 - 88",
                direction: "Xuất hành hướng Đông Nam nghênh đón Hỷ Thần."
            },
            {
                id: 2,
                category: ['wealth', 'career'],
                title: "QUẺ SỐ 02: THẦN TÀI GÕ CỬA",
                grade: "ĐẠI CÁT ĐẠI LỢI ★★★★★",
                poem: "Khai môn tiếp đón vạn ngân tài,\nBuôn bán sinh lời chẳng nhạt phai.\nCơ hội ngàn năm vừa gõ cửa,\nTương lai rực rỡ đón xuân tươi.",
                career: "Các dự án ấp ủ đều đạt kết quả vượt bậc, uy tín vang xa, được cấp trên và đối tác tin cậy.",
                wealth: "Kinh doanh phát đạt, đầu tư đúng thời điểm, nguồn thu phụ dồi dào bất ngờ.",
                love: "Tình cảm mặn nồng, có tin vui về hôn sự hoặc chào đón thêm thành viên mới đáng yêu.",
                health: "Sức khỏe dẻo dai, giữ tinh thần lạc quan yêu đời là liều thuốc quý nhất.",
                luckyNumber: "09 - 39 - 79",
                direction: "Xuất hành hướng Chính Nam nghênh đón Tài Thần."
            },
            {
                id: 3,
                category: ['love'],
                title: "QUẺ SỐ 03: DUYÊN TÌNH PHƠI PHỚI",
                grade: "HỶ KHÍ BẢO ĐIỂM ★★★★★",
                poem: "Hoa đào hé nụ đón xuân sang,\nSe mối tơ duyên thắm nồng nàn.\nTay nắm bàn tay cùng cất bước,\nTrăm năm tình nghĩa mãi hân hoan.",
                career: "Môi trường làm việc chan hòa, đồng nghiệp hỗ trợ hết mình, việc khó hóa dễ.",
                wealth: "Tài chính ổn định, tích lũy được khoản tiền lớn để thực hiện những chuyến du lịch đáng nhớ.",
                love: "Đào hoa vượng phát! Người thương sẽ chủ động bày tỏ tình cảm chân thành và ngọt ngào.",
                health: "Tâm hồn phơi phới, làn da rạng rỡ, ngủ ngon giấc, tinh thần phấn chấn.",
                luckyNumber: "12 - 24 - 99",
                direction: "Xuất hành hướng Đông Bắc để gặp điều may mắn trong nhân duyên."
            },
            {
                id: 4,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 04: THUẬN BUỒM XUÔI GIÓ",
                grade: "VẠN SỰ NHƯ Ý ★★★★★",
                poem: "Gió lộng buồm giương vượt sóng trùng,\nGian nan lùi bước dạ kiên trung.\nĐường mây thẳng tiến thênh thang bước,\nThỏa chí tang bồng đất càn khôn.",
                career: "Mọi sự chuyển mình ngoạn mục, gặt hái thành tựu sau chuỗi ngày nỗ lực không ngừng nghỉ.",
                wealth: "Tiền bạc hanh thông, các khoản nợ cũ được giải quyết triệt để, tài sản gia tăng vững chắc.",
                love: "Gia đình luôn là hậu phương vững chãi, cùng nhau chia ngọt sẻ bùi.",
                health: "Thể chất khỏe khoắn, thích hợp tham gia các môn thể thao mới để nâng cao đề kháng.",
                luckyNumber: "08 - 28 - 66",
                direction: "Xuất hành hướng Tây Nam gặp cát tinh che chở."
            },
            {
                id: 5,
                category: ['health', 'love'],
                title: "QUẺ SỐ 05: PHÚC THỌ TRƯỜNG VINH",
                grade: "TOÀN GIA AN KHANG ★★★★★",
                poem: "Cây cao bóng mát trổ ngàn hoa,\nCon cháu sum vầy rộn tiếng ca.\nTrăm tuổi thanh xuân còn mãi đó,\nBình an phúc lộc đến muôn nhà.",
                career: "Công việc đi vào quỹ đạo ổn định, không còn áp lực hay bon chen, thu nhập đều đặn vững vàng.",
                wealth: "Chi tiêu thong thả, có của ăn của để, lộc trời ban cho những người sống thơm thảo.",
                love: "Vợ chồng hòa thuận, con cái ngoan ngoãn đỗ đạt, trên kính dưới nhường.",
                health: "Thọ trường khang kiện, tránh xa mọi âu lo ưu phiền, tinh thần thanh tịnh tuyệt vời.",
                luckyNumber: "16 - 36 - 86",
                direction: "Xuất hành hướng Chính Đông rước may mắn tài lộc."
            },
            {
                id: 6,
                category: ['career', 'study'],
                title: "QUẺ SỐ 06: BẢO MÃ NGHÊNH XUÂN",
                grade: "CÔNG DANH HIỂN HÁCH ★★★★★",
                poem: "Tuấn mã tung hoành vạn dặm xa,\nĐầu xuân danh tiếng rạng muôn nhà.\nChí lớn trời mây nay thỏa nguyện,\nKhải hoàn khúc hát rộn ngàn hoa.",
                career: "Thăng quan tiến chức, đường công danh rộng mở thênh thang, nắm giữ vị trí quan trọng trong tổ chức.",
                wealth: "Lương thưởng tăng vọt, được tưởng thưởng xứng đáng cho tài năng xuất chúng.",
                love: "Được bạn đời hết lòng ủng hộ sự nghiệp, gia đình hòa thuận đầm ấm.",
                health: "Tràn đầy sinh lực, tinh lực dồi dào, trí óc minh mẫn sáng suốt.",
                luckyNumber: "06 - 26 - 66",
                direction: "Xuất hành hướng Chính Bắc gặp sao Văn Xương trợ mệnh."
            },
            {
                id: 7,
                category: ['wealth'],
                title: "QUẺ SỐ 07: TẤN TÀI TẤN LỘC",
                grade: "TÀI VẬN HANH THÔNG ★★★★★",
                poem: "Đất nở vàng tươi ngọc sáng ngời,\nTài lộc đơm bông thỏa ước đời.\nKho đụn đầy vơi tiền chất ngất,\nXuân về thịnh vượng ấm lòng người.",
                career: "Kinh doanh buôn bán một vốn bốn lời, mở rộng chi nhánh hoặc mặt bằng kinh doanh thuận lợi.",
                wealth: "Dòng tiền lưu thông trơn tru, gặp được mối làm ăn sinh lời khủng lâu dài.",
                love: "Tình cảm gia đình gắn kết keo sơn, cùng nhau vun vén tổ ấm giàu sang.",
                health: "Sức khỏe ổn định, ăn ngon ngủ tốt, tinh thần phơi phới yêu đời.",
                luckyNumber: "18 - 68 - 98",
                direction: "Xuất hành hướng Đông Nam nghênh đón Thần Tài đại cát."
            },
            {
                id: 8,
                category: ['study', 'career'],
                title: "QUẺ SỐ 08: KHOA BẢNG KHÔI NGUYÊN",
                grade: "ĐỖ ĐẠT ĐỈNH CAO ★★★★★",
                poem: "Bút nghiên rèn luyện mấy mùa đông,\nBảng vàng nay khắc rạng non sông.\nCá hóa rồng bay vờn sóng bạc,\nRạng danh gia tộc thỏa hoài mong.",
                career: "Thi cử đỗ đạt, đạt học bổng lớn, bảo vệ xuất sắc luận án hoặc chuyển ngành thành công rực rỡ.",
                wealth: "Nhận được tài trợ, giải thưởng hoặc học bổng có giá trị tài chính lớn.",
                love: "Được bạn bè cùng chí hướng quý mến, kết giao tri kỷ học thức uyên bác.",
                health: "Chú ý bồi bổ thị lực và ngủ đủ giấc sau những ngày dùi mài kinh sử.",
                luckyNumber: "01 - 10 - 100",
                direction: "Xuất hành hướng Chính Đông gặp quý nhân học vấn."
            },
            {
                id: 9,
                category: ['love', 'health'],
                title: "QUẺ SỐ 09: NGŨ PHÚC LÂM MÔN",
                grade: "GIA ĐẠO HƯNG LONG ★★★★★",
                poem: "Năm phúc cùng về trước cửa nhà:\nThọ - Phú - Khang - Ninh lẫn Đức hoa.\nCon cháu thảo hiền vui họp mặt,\nXuân sang thắm đượm nghĩa êm hòa.",
                career: "Gia đình làm ăn phát đạt, con cháu kế nghiệp vẻ vang, nội bộ tương trợ lẫn nhau.",
                wealth: "Tài lộc vững bền, đời này tích lũy cho con cháu đời sau thụ hưởng.",
                love: "Gia đình đoàn viên tưng bừng, đón tin hỷ cưới hỏi hoặc thêm dâu hiền rể thảo.",
                health: "Cả nhà mạnh khỏe, các bậc cao niên sống lâu trường thọ, trẻ nhỏ thông minh hoạt bát.",
                luckyNumber: "05 - 55 - 95",
                direction: "Xuất hành hướng Nam nghênh đón Hỷ Thần bảo trợ."
            },
            {
                id: 10,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 10: TỌA THƯỢNG PHONG VÂN",
                grade: "KHỞI NGHIỆP THÀNH CÔNG ★★★★★",
                poem: "Gặp thời vẫy cánh giữa tầng mây,\nKhởi dựng cơ đồ vững chắc tay.\nBè bạn muôn nơi cùng góp sức,\nThành công vang dội tháng năm này.",
                career: "Ý tưởng khởi nghiệp được rót vốn, dự án mới vận hành trơn tru và tạo dấu ấn mạnh mẽ trên thị trường.",
                wealth: "Lợi nhuận vượt mức mong đợi, mở ra nhiều cơ hội đầu tư sinh lời bền vững.",
                love: "Gặp được bạn đồng hành thấu hiểu, chia sẻ ngọt bùi và cổ vũ ước mơ lớn.",
                health: "Duy trì lịch tập thể dục đều đặn để giữ vững nguồn năng lượng đỉnh cao.",
                luckyNumber: "03 - 33 - 77",
                direction: "Xuất hành hướng Tây Bắc gặp quý nhân dẫn lối."
            },
            {
                id: 11,
                category: ['love'],
                title: "QUẺ SỐ 11: LONG PHỤNG TRÌNH TƯỜNG",
                grade: "LƯƠNG DUYÊN TRĂM NĂM ★★★★★",
                poem: "Rồng bay phượng múa giữa trời thanh,\nSe kết tơ duyên đượm ý lành.\nMột dạ sắt son cùng gắn bó,\nTrọn đời son sắt mãi đồng hành.",
                career: "Hậu phương vững chắc tiếp thêm đôi cánh cho sự nghiệp thăng hoa vượt bậc.",
                wealth: "Vợ chồng chung lưng đấu cậy, đồng lòng tát cạn biển đông, tiền của tích lũy dồi dào.",
                love: "Duyên phận an bài đẹp tựa bài thơ, tiến tới hôn nhân viên mãn, tình cảm sắc son trọn đời.",
                health: "Tinh thần thảnh thơi, sắc mặt hồng hào, hạnh phúc lan tỏa đến mọi người xung quanh.",
                luckyNumber: "02 - 22 - 82",
                direction: "Xuất hành hướng Đông Nam để rước hỷ khí vào nhà."
            },
            {
                id: 12,
                category: ['health'],
                title: "QUẺ SỐ 12: BÌNH AN ĐẠI CÁT",
                grade: "THÂN TÂM THƯ THÁI ★★★★★",
                poem: "Bình an là phúc lớn trần gian,\nChẳng chút ưu tư dạ nhẹ nhàng.\nSáng sớm nhấp trà nghe én hót,\nChiều về thanh thản ánh xuân sang.",
                career: "Mọi công việc diễn ra êm đềm, không gặp thị phi trắc trở, môi trường an lành tĩnh tại.",
                wealth: "Tài chính đủ đầy sung túc, không nợ nần, cuộc sống tự do tự tại.",
                love: "Các mối quan hệ thân tình, không vướng bận tranh cãi, gia đạo bình an vô sự.",
                health: "Cơ thể dẻo dai khỏe mạnh, thân tâm thanh tịnh, ngủ ngon một mạch tới sáng.",
                luckyNumber: "04 - 44 - 84",
                direction: "Xuất hành hướng Chính Tây gặp sao Phúc Tinh."
            },
            {
                id: 13,
                category: ['wealth'],
                title: "QUẺ SỐ 13: KIM NGỌC MÃN ĐƯỜNG",
                grade: "TIỀN VÀNG ĐẦY TÚI ★★★★★",
                poem: "Ngọc biếc vàng son rực rỡ nhà,\nLộc xuân tươi thắm sắc ngàn hoa.\nKinh doanh thuận buồm xuôi nước ngọt,\nPhú quý vinh hoa khắp cõi xa.",
                career: "Doanh số nhảy vọt, ký kết nhiều dự án mang về doanh thu hàng đầu trong năm.",
                wealth: "Vàng bạc đầy két, tài sản đất đai gia tăng, vận may trúng số hoặc nhận thưởng bất ngờ.",
                love: "Cuộc sống gia đình sung túc, đủ điều kiện chăm lo chu đáo cho các thế hệ.",
                health: "Sức khỏe sung mãn, tâm trạng vui tươi phấn chấn mỗi sớm mai thức dậy.",
                luckyNumber: "19 - 79 - 89",
                direction: "Xuất hành hướng Chính Nam rước Thần Tài vào nhà."
            },
            {
                id: 14,
                category: ['career', 'study'],
                title: "QUẺ SỐ 14: XUÂN PHONG ĐẮC Ý",
                grade: "THỜI VẬN THĂNG HOA ★★★★★",
                poem: "Gió xuân mơn man lướt áo hoa,\nMọi việc hanh thông khắp xứ xa.\nNgẩng đầu cười lớn vang trời đất,\nVinh hiển rạng soi lối bước qua.",
                career: "Được lãnh đạo ghi nhận, thăng tiến vùn vụt, có cơ hội đi công tác nước ngoài mở mang tầm nhìn.",
                wealth: "Thu nhập tăng trưởng lũy tiến, các khoản đầu tư sinh lời đều đặn.",
                love: "Được nhiều người ngưỡng mộ và theo đuổi, người có gia đình thì tràn đầy yêu thương.",
                health: "Sức đề kháng cực tốt, tràn ngập năng lượng tích cực.",
                luckyNumber: "15 - 51 - 91",
                direction: "Xuất hành hướng Đông Bắc đón gió lành may mắn."
            },
            {
                id: 15,
                category: ['career', 'study'],
                title: "QUẺ SỐ 15: NHẤT PHI TRÙNG THIÊN",
                grade: "BỨT PHÁ NGOẠN MỤC ★★★★★",
                poem: "Bao năm tích lũy chí chưa vơi,\nNay cánh chim bằng vút cõi khơi.\nBứt phá ngoạn mục lên đỉnh chóp,\nVang danh bốn bể rạng phương trời.",
                career: "Vượt qua thử thách một cách thần kỳ, biến nguy thành cơ, bước lên tầm cao danh vọng mới.",
                wealth: "Thu hoạch lớn từ những nỗ lực bấy lâu nay, tài vận nhảy bậc vững bền.",
                love: "Sự tự tin và thành đạt khiến bạn trở thành thỏi nam châm thu hút đối phương.",
                health: "Thể chất tràn đầy phong độ, sẵn sàng chinh phục những cột mốc cao hơn.",
                luckyNumber: "07 - 77 - 97",
                direction: "Xuất hành hướng Tây Nam đón cát khí thiên địa."
            },
            {
                id: 16,
                category: ['career', 'love'],
                title: "QUẺ SỐ 16: QUÝ NHÂN TƯƠNG HỖ",
                grade: "MUÔN PHƯƠNG ĐỠ ĐẦU ★★★★★",
                poem: "Đi đâu cũng gặp người đưa lối,\nKhó khăn lập tức hóa mây bay.\nÂn tình sâu nặng muôn phương gửi,\nẤm áp nghĩa nhân tháng lại ngày.",
                career: "Lúc ngặt nghèo có người xuất hiện gỡ rối, được chỉ bảo bí quyết nhà nghề quý giá.",
                wealth: "Được người đáng tin cậy mách nước kinh doanh, kiếm tiền thuận lợi dễ dàng.",
                love: "Gặp được tri kỷ nâng đỡ tinh thần, cùng nhau sẻ chia buồn vui cuộc sống.",
                health: "Nhờ giữ tâm thiện lành mà thân thể an ổn, ít đau ốm bệnh tật vặt vãnh.",
                luckyNumber: "13 - 31 - 83",
                direction: "Xuất hành hướng Chính Đông gặp sao Thiên Đức."
            },
            {
                id: 17,
                category: ['love', 'health'],
                title: "QUẺ SỐ 17: HOAN HỶ ĐOÀN VIÊN",
                grade: "GIA HÒA VẠN SỰ HƯNG ★★★★★",
                poem: "Bếp lửa reo vui đón Tết về,\nBánh chưng thơm ngát ấm miền quê.\nCả nhà sum họp cười rạng rỡ,\nTrọn vẹn tình thâm thỏa ước thề.",
                career: "Công việc thuận lợi cho phép dành nhiều thời gian hơn để chăm sóc gia đình.",
                wealth: "Tài chính ổn định, đủ điều kiện lo cho người thân cuộc sống đủ đầy tiện nghi.",
                love: "Mọi mâu thuẫn cũ tan biến, tình thân keo sơn, chan chứa tình yêu thương ấm áp.",
                health: "Tâm lý thoải mái, gia đình vui vẻ là phương thuốc bổ tốt nhất cho sức khỏe.",
                luckyNumber: "14 - 41 - 94",
                direction: "Xuất hành hướng Nam nghênh đón cát tường."
            },
            {
                id: 18,
                category: ['career', 'wealth'],
                title: "QUẺ SỐ 18: VẠN TƯỢNG CANH TÂN",
                grade: "ĐỔI MỚI THÀNH CÔNG ★★★★★",
                poem: "Trút bỏ bụi mờ của tháng qua,\nBình minh rực rỡ đón xuân hoa.\nKhởi đầu chương mới bao điều lạ,\nThắng lợi huy hoàng rạng gấm hoa.",
                career: "Chuyển mình mạnh mẽ, áp dụng công nghệ mới thành công vượt bậc, vị thế dẫn đầu.",
                wealth: "Tìm ra nguồn thu nhập thụ động mới đầy tiềm năng, kinh tế thăng hoa.",
                love: "Tình cảm được làm mới, cảm xúc thăng hoa như những ngày đầu mới yêu.",
                health: "Thay đổi thói quen sinh hoạt lành mạnh, cơ thể khỏe mạnh dẻo dai hơn.",
                luckyNumber: "11 - 61 - 81",
                direction: "Xuất hành hướng Đông Nam đón luồng sinh khí mới."
            },
            {
                id: 19,
                category: ['study', 'career'],
                title: "QUẺ SỐ 19: CÁ CHÉP HÓA RỒNG",
                grade: "VƯỢT VŨ MÔN QUAN ★★★★★",
                poem: "Vượt ngọn sóng cao dẫu nhọc nhằn,\nVươn mình hóa bóng phượng rồng lân.\nĐạp mây cưỡi gió bay muôn lối,\nKhắc dấu tài năng giữa thế trần.",
                career: "Vượt qua kỳ thi sát hạch gắt gao, chuyển sang cấp bậc chuyên gia được kính nể.",
                wealth: "Thu nhập tăng vọt theo cấp bậc chức danh mới.",
                love: "Tìm được người thấu hiểu và trân trọng sự cố gắng bền bỉ của bạn.",
                health: "Giải tỏa áp lực thi cử, cơ thể thư thái, tràn đầy sức sống thanh xuân.",
                luckyNumber: "09 - 49 - 99",
                direction: "Xuất hành hướng Chính Bắc đón sao Thiên Hỷ."
            },
            {
                id: 20,
                category: ['wealth', 'love'],
                title: "QUẺ SỐ 20: ĐỨC TÀI VIÊN MÃN",
                grade: "PHÚC ĐỨC THÂM SÂU ★★★★★",
                poem: "Sống thuận lòng nhân đất nở hoa,\nPhúc dày đức rộng đến muôn nhà.\nTrời ban phúc lộc người thơm thảo,\nMột cõi an bình mãi ngát xa.",
                career: "Làm việc bằng cái tâm trong sáng nên được cộng đồng và đối tác kính trọng tuyệt đối.",
                wealth: "Càng làm từ thiện sẻ chia thì tài lộc càng sinh sôi nảy nở gấp bội.",
                love: "Gia đình trên dưới một lòng, con cháu noi gương cha mẹ sống nhân hậu thành tài.",
                health: "Tâm an thì bệnh tật tiêu tan, cuộc sống an nhiên trường thọ vô ưu.",
                luckyNumber: "17 - 57 - 87",
                direction: "Xuất hành hướng Chính Tây nghênh đón cát tinh."
            },
            {
                id: 21,
                category: ['wealth', 'career'],
                title: "QUẺ SỐ 21: THỜI VẬN ĐẮC THẾ",
                grade: "GẶP THỜI HÁI LỘC ★★★★★",
                poem: "Gặp lúc cờ trao phải phất ngay,\nThời cơ vàng ngọc chớ buông tay.\nTài năng ấp ủ nay bừng sáng,\nThắng lợi giòn giã đẹp mắt thay.",
                career: "Bắt đúng xu hướng thị trường, dẫn dắt trào lưu, gặt hái thành công vượt trội.",
                wealth: "Lợi nhuận đến từ nhiều nguồn khác nhau, chi tiêu sung túc không cần tính toán.",
                love: "Tình cảm đôi lứa thăng hoa, cùng nhau chia sẻ những thành quả ngọt ngào.",
                health: "Tràn đầy khí thế, thể lực sung mãn, làm việc không biết mệt mỏi.",
                luckyNumber: "21 - 71 - 88",
                direction: "Xuất hành hướng Đông Nam đón lộc đầu xuân."
            },
            {
                id: 22,
                category: ['all'],
                title: "QUẺ SỐ 22: TÂM THÀNH Ý TOẠI",
                grade: "CẦU GÌ ĐƯỢC NẤY ★★★★★",
                poem: "Thành tâm hướng thiện đón xuân tươi,\nCầu lộc cầu tài thỏa ước đời.\nVạn sự hanh thông như ý nguyện,\nNụ cười rạng rỡ nở trên môi.",
                career: "Những ước vọng ấp ủ bấy lâu nay đều lần lượt trở thành hiện thực viên mãn.",
                wealth: "Tài chính dồi dào, giải quyết êm đẹp mọi gánh nặng kinh tế.",
                love: "Cầu duyên được duyên, cầu tự được tự, trăm năm hòa thuận.",
                health: "Thân tâm an lạc, tràn trề sinh lực, tinh thần lạc quan phơi phới.",
                luckyNumber: "23 - 63 - 93",
                direction: "Xuất hành hướng Chính Đông đón ánh bình minh khai vận."
            },
            {
                id: 23,
                category: ['health'],
                title: "QUẺ SỐ 23: DIÊN NIÊN ÍCH THỌ",
                grade: "SỨC BẬT TUỔI XUÂN ★★★★★",
                poem: "Thân như bách diệp giữa ngàn phong,\nDẻo dai đứng vững giữa tầng không.\nKhí huyết lưu thông tràn nhựa sống,\nXuân về thọ dưỡng ấm cõi lòng.",
                career: "Đầu óc minh mẫn, đưa ra những quyết sách sáng suốt giúp tổ chức tiến xa.",
                wealth: "Tích lũy tài sản vững chãi cho tương lai, cuộc sống an nhàn tự tại.",
                love: "Con cháu sum vầy phụng dưỡng, gia đình hạnh phúc tràn ngập tiếng cười.",
                health: "Sức khỏe vô địch, bệnh tật lùi xa, da dẻ hồng hào, tinh thần sảng khoái.",
                luckyNumber: "25 - 65 - 85",
                direction: "Xuất hành hướng Nam rước dương khí an khang."
            },
            {
                id: 24,
                category: ['wealth', 'career'],
                title: "QUẺ SỐ 24: BÁCH NGHIỆP HƯNG THỊNH",
                grade: "KINH THƯƠNG PHÁT ĐẠT ★★★★★",
                poem: "Trăm nghề trăm nghiệp bước vào xuân,\nMua bán giao thương nhộn nhịp dần.\nUy tín tạo nên nguồn của cải,\nVinh hoa phú quý rạng muôn phần.",
                career: "Xây dựng thương hiệu uy tín vững chắc, khách hàng tin tưởng và gắn bó dài lâu.",
                wealth: "Doanh thu tăng trưởng kỷ lục, vốn lưu động dồi dào, mở rộng đầu tư sinh lời lớn.",
                love: "Được gia đình và bạn bè ủng hộ nhiệt thành trên con đường phát triển sự nghiệp.",
                health: "Cần chú ý cân bằng giữa công việc và nghỉ ngơi để duy trì phong độ dài lâu.",
                luckyNumber: "29 - 69 - 89",
                direction: "Xuất hành hướng Tây Bắc đón thần may mắn trợ vận."
            }
        ];

        // Cấu hình chi tiết cho từng ý nguyện cầu an
        this.intentConfigs = {
            all: {
                id: 'all',
                name: 'Toàn Duyên Vận Mệnh',
                icon: '🌟',
                kanji: '靈',
                ribbon: 'LINH QUẺ 2027',
                btnText: 'Lắc Ống Xăm Toàn Duyên 2027',
                desc: 'Chiêm bái tổng hòa vận thế năm Đinh Mùi 2027 (Công danh, Tài lộc, Tình duyên, Sức khỏe, Khoa cử).',
                advice: '💡 <strong>Lời Khuyên Khai Vận Toàn Duyên 2027:</strong> Năm Đinh Mùi hòa hợp, xuất hành nghênh đón Hỷ Thần hướng Đông Nam, Tài Thần hướng Chính Nam. Giữ tâm an hoan hỷ, tích đức hành thiện thì vạn sự hanh thông, đại cát đại lợi!'
            },
            career: {
                id: 'career',
                name: 'Công Danh & Sự Nghiệp',
                icon: '💼',
                kanji: '祿',
                ribbon: 'CÔNG DANH KHỞI SẮC',
                btnText: 'Lắc Ống Xăm Cầu Công Danh',
                desc: 'Ưu tiên các quẻ chuyên sâu về thăng quan tiến chức, mở rộng quy mô, ký kết hợp đồng và uy danh sự nghiệp.',
                advice: '💡 <strong>Lời Khuyên Khai Vận Công Danh 2027:</strong> Chọn ngày Mùng 4 hoặc Mùng 6 Tết để mở máy khai xuân. Đặt một chậu kim tiền hoặc tháp văn xương trên bàn làm việc hướng Bắc để kích hoạt quý nhân tương trợ!'
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

        this.isShaking = false;
        this.bindEvents();
        this.updateIntentUI('all');
    }

    updateIntentUI(category) {
        const config = this.intentConfigs[category] || this.intentConfigs['all'];
        
        // Cập nhật banner ý nguyện
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
        if (shakeBtn) shakeBtn.innerHTML = `<span>${config.icon}</span> ${config.btnText}`;

        if (kanjiEl) kanjiEl.textContent = config.kanji;
        if (ribbonEl) ribbonEl.textContent = config.ribbon;

        // Hiệu ứng xoay nảy 3D ấn triện tạo phản hồi tương tác trực quan ngay tức khắc
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

        // Bấm chọn ý nguyện cầu an: cập nhật UI ngay lập tức
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCategory = btn.getAttribute('data-category') || 'all';

                // Cập nhật giao diện trực quan ngay lập tức
                this.updateIntentUI(this.selectedCategory);

                if (window.tetAudio) {
                    window.tetAudio.init();
                    window.tetAudio.playLuckyChime();
                }

                const toast = document.getElementById('tet-toast');
                if (toast) {
                    const label = btn.textContent.trim();
                    toast.innerHTML = `🎋 Đã chọn ý nguyện: <strong>${label}</strong>. Hãy lắc ống xăm để nhận quẻ ứng nghiệm!`;
                    toast.classList.remove('hidden');
                    setTimeout(() => toast.classList.add('hidden'), 2500);
                }
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

        const cup = document.getElementById('fortune-cup-element');
        const stick = document.getElementById('fortune-bamboo-stick');
        const bundle = cup ? cup.querySelector('.bamboo-sticks-bundle') : null;
        const shakeBtn = document.getElementById('btn-shake-fortune');

        if (shakeBtn) {
            shakeBtn.disabled = true;
            shakeBtn.style.opacity = '0.7';
            shakeBtn.style.pointerEvents = 'none';
        }

        if (window.tetAudio) {
            window.tetAudio.playBambooShake();
        }

        if (cup) cup.classList.add('shake-animation-3d');
        if (bundle) bundle.classList.add('sticks-clatter-animation');

        // Hiệu ứng tia sáng vàng tinh tú phát ra từ miệng ống khi xóc
        if (window.fireworks && cup) {
            const rect = cup.getBoundingClientRect();
            const sparkX = rect.left + rect.width / 2;
            const sparkY = rect.top + 25;
            setTimeout(() => {
                if (window.fireworks) window.fireworks.explodeAt(sparkX, sparkY, ['#ffd700', '#fff8dc']);
            }, 300);
            setTimeout(() => {
                if (window.fireworks) window.fireworks.explodeAt(sparkX, sparkY, ['#ffaa00', '#ffd700']);
            }, 650);
        }

        // Thẻ xăm phóng bay vút lên với hào quang kim sắc
        setTimeout(() => {
            if (stick) stick.classList.add('stick-fly-out-3d');
            if (window.tetAudio) {
                window.tetAudio.playLuckyChime();
            }
        }, 850);

        setTimeout(() => {
            if (cup) cup.classList.remove('shake-animation-3d');
            if (bundle) bundle.classList.remove('sticks-clatter-animation');
            if (stick) stick.classList.remove('stick-fly-out-3d');
            if (shakeBtn) {
                shakeBtn.disabled = false;
                shakeBtn.style.opacity = '1';
                shakeBtn.style.pointerEvents = 'auto';
            }
            this.isShaking = false;
            this.showFortuneByCategory();
        }, 1800);
    }

    showFortuneByCategory() {
        const config = this.intentConfigs[this.selectedCategory] || this.intentConfigs['all'];

        // Lọc pool quẻ theo đúng ý nguyện (hoặc quẻ all)
        let pool = this.fortunes;
        if (this.selectedCategory && this.selectedCategory !== 'all') {
            pool = this.fortunes.filter(f => f.category.includes(this.selectedCategory) || f.category.includes('all'));
            if (pool.length === 0) pool = this.fortunes;
        }

        const randomIndex = Math.floor(Math.random() * pool.length);
        const item = pool[randomIndex];

        const titleEl = document.getElementById('fortune-res-title');
        const numPillEl = document.getElementById('fortune-res-num-pill');
        const nameTextEl = document.getElementById('fortune-res-name-text');
        const gradeEl = document.getElementById('fortune-res-grade');
        const poemEl = document.getElementById('fortune-res-poem');
        const numberEl = document.getElementById('fortune-res-number');
        const directionEl = document.getElementById('fortune-res-direction');
        const intentBadge = document.getElementById('fortune-modal-intent-badge');
        const focusTitle = document.getElementById('fortune-focus-title');
        const focusDesc = document.getElementById('fortune-focus-desc');
        const adviceBox = document.getElementById('fortune-res-advice-box');

        // Tách số quẻ và tên quẻ để làm nổi bật biển tên quẻ Hoàng gia
        const colonIdx = item.title.indexOf(':');
        if (colonIdx !== -1) {
            const numPart = item.title.substring(0, colonIdx).trim();
            const namePart = item.title.substring(colonIdx + 1).trim();
            if (numPillEl) numPillEl.textContent = numPart;
            if (nameTextEl) nameTextEl.textContent = namePart;
        } else {
            if (numPillEl) numPillEl.textContent = 'QUẺ SỐ';
            if (nameTextEl) nameTextEl.textContent = item.title;
        }
        if (titleEl) titleEl.textContent = item.title;
        if (gradeEl) gradeEl.textContent = item.grade;
        if (poemEl) poemEl.textContent = item.poem;
        if (numberEl) numberEl.textContent = item.luckyNumber;
        if (directionEl) directionEl.textContent = item.direction;

        // Cập nhật huy hiệu ý nguyện đã cầu trong Modal
        if (intentBadge) {
            intentBadge.innerHTML = `<span>${config.icon}</span> Ý Nguyện: <strong>${config.name}</strong>`;
        }

        // Lời giải học vấn khoa cử chất lượng cao
        const studyText = item.study || (
            item.grade.includes('THƯỢNG')
                ? "Thi cử đỗ đạt, đề tên bảng vàng, thi cử học bổng đều đạt kết quả xuất sắc vượt bậc."
                : "Trí tuệ minh mẫn sáng suốt, học tập tiến bộ không ngừng, nỗ lực ắt gặt hái thành tích cao."
        );

        // Tập hợp 5 phương diện chi tiết
        const domains = {
            career: { key: 'career', label: '💼 Công Danh & Sự Nghiệp:', text: item.career },
            wealth: { key: 'wealth', label: '💰 Tài Lộc & Kinh Doanh:', text: item.wealth },
            love:   { key: 'love',   label: '❤️ Tình Duyên & Gia Đạo:', text: item.love },
            health: { key: 'health', label: '🩺 Sức Khỏe & Bình An:', text: item.health },
            study:  { key: 'study',  label: '🎓 Khoa Cử & Học Vấn:', text: studyText }
        };

        // Phân bổ thẻ trọng tâm và 4 thẻ phụ (Lưới 2x2 gọn gàng, không thanh cuộn)
        let focusText = '';
        let subKeys = [];

        if (this.selectedCategory === 'career') {
            if (focusTitle) focusTitle.innerHTML = `💼 TRỌNG TÂM CẦU CÔNG DANH & SỰ NGHIỆP`;
            focusText = item.career;
            subKeys = ['wealth', 'love', 'health', 'study'];
        } else if (this.selectedCategory === 'wealth') {
            if (focusTitle) focusTitle.innerHTML = `💰 TRỌNG TÂM CẦU TÀI LỘC & KINH DOANH`;
            focusText = item.wealth;
            subKeys = ['career', 'love', 'health', 'study'];
        } else if (this.selectedCategory === 'love') {
            if (focusTitle) focusTitle.innerHTML = `❤️ TRỌNG TÂM CẦU TÌNH DUYÊN & GIA ĐẠO`;
            focusText = item.love;
            subKeys = ['career', 'wealth', 'health', 'study'];
        } else if (this.selectedCategory === 'health') {
            if (focusTitle) focusTitle.innerHTML = `🩺 TRỌNG TÂM CẦU SỨC KHỎE & BÌNH AN`;
            focusText = item.health;
            subKeys = ['career', 'wealth', 'love', 'study'];
        } else if (this.selectedCategory === 'study') {
            if (focusTitle) focusTitle.innerHTML = `🎓 TRỌNG TÂM CẦU KHOA CỬ & HỌC VẤN`;
            focusText = studyText;
            subKeys = ['career', 'wealth', 'love', 'health'];
        } else {
            if (focusTitle) focusTitle.innerHTML = `🌟 VẬN TRÌNH TOÀN DUYÊN ĐẠI CÁT 2027`;
            focusText = "Mở lối công danh bừng phú quý, tài lộc cuồn cuộn đổ về, nhân duyên hòa hợp, gia đạo an vui hạnh phúc trọn vẹn.";
            subKeys = ['career', 'wealth', 'love', 'health'];
        }

        if (focusDesc) focusDesc.textContent = focusText;

        // Điền nội dung cho 4 thẻ phụ dạng lưới 2x2
        subKeys.slice(0, 4).forEach((key, idx) => {
            const num = idx + 1;
            const labelEl = document.getElementById(`sub-card-label-${num}`);
            const descEl = document.getElementById(`sub-card-desc-${num}`);
            if (labelEl) labelEl.textContent = domains[key].label;
            if (descEl) descEl.textContent = domains[key].text;
        });

        // Cập nhật lời khuyên phong thủy khai vận
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
            const toast = document.getElementById('tet-toast');
            if (toast) {
                toast.innerHTML = '📋 Đã sao chép nội dung quẻ xăm vào bộ nhớ tạm! Bạn có thể chia sẻ cho người thân!';
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 3000);
            }
        }).catch(() => {
            alert('Đã sao chép quẻ xăm!');
        });
    }
}

window.FortuneSystem = FortuneSystem;
