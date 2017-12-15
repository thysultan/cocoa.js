#import <JavaScriptCore/JavaScriptCore.h>

@protocol JavaScriptControllerExports <JSExport>
+ (void) require: (NSString *) file;
+ (void) log: (NSString *) message;
+ (void) postMessage: (JSValue *) message;
+ (instancetype) instantiate;
@end

@class JavaScriptController;
@interface JavaScriptController: NSObject<JavaScriptControllerExports>
@end
